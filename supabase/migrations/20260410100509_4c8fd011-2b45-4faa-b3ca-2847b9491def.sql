
-- Create admin role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: Only admins can view all roles, users can see their own
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create admin_analytics view for dashboard stats
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM public.chat_sessions) AS total_sessions,
  (SELECT COUNT(*) FROM public.chat_messages) AS total_messages,
  (SELECT COUNT(DISTINCT user_id) FROM public.chat_sessions WHERE created_at > now() - interval '24 hours') AS active_users_24h,
  (SELECT COUNT(*) FROM public.chat_sessions WHERE created_at > now() - interval '24 hours') AS sessions_24h,
  (SELECT COUNT(*) FROM public.chat_messages WHERE created_at > now() - interval '24 hours') AS messages_24h;

-- Create feedback table for message ratings
CREATE TABLE public.message_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  message_content TEXT,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.message_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback"
ON public.message_feedback FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback"
ON public.message_feedback FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
ON public.message_feedback FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Daily stats table for historical analytics
CREATE TABLE public.daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE,
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  top_moods JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view daily stats"
ON public.daily_stats FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert daily stats"
ON public.daily_stats FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Function to get mood distribution
CREATE OR REPLACE FUNCTION public.get_mood_distribution()
RETURNS TABLE(mood TEXT, count BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT mood, COUNT(*) as count
  FROM public.chat_sessions
  WHERE created_at > now() - interval '30 days'
  GROUP BY mood
  ORDER BY count DESC
  LIMIT 20;
$$;

-- Function to get daily message counts for charts
CREATE OR REPLACE FUNCTION public.get_daily_message_counts(days_back INTEGER DEFAULT 30)
RETURNS TABLE(day DATE, msg_count BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DATE(created_at) as day, COUNT(*) as msg_count
  FROM public.chat_messages
  WHERE created_at > now() - make_interval(days => days_back)
  GROUP BY DATE(created_at)
  ORDER BY day;
$$;

-- Function to get daily active users for charts
CREATE OR REPLACE FUNCTION public.get_daily_active_users(days_back INTEGER DEFAULT 30)
RETURNS TABLE(day DATE, user_count BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DATE(cs.created_at) as day, COUNT(DISTINCT cs.user_id) as user_count
  FROM public.chat_sessions cs
  WHERE cs.created_at > now() - make_interval(days => days_back)
  GROUP BY DATE(cs.created_at)
  ORDER BY day;
$$;
