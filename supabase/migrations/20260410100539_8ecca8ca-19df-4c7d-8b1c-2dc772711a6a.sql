
-- Drop the insecure view
DROP VIEW IF EXISTS public.admin_dashboard_stats;

-- Replace with a security definer function (admin-only)
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'total_sessions', (SELECT COUNT(*) FROM public.chat_sessions),
    'total_messages', (SELECT COUNT(*) FROM public.chat_messages),
    'active_users_24h', (SELECT COUNT(DISTINCT user_id) FROM public.chat_sessions WHERE created_at > now() - interval '24 hours'),
    'sessions_24h', (SELECT COUNT(*) FROM public.chat_sessions WHERE created_at > now() - interval '24 hours'),
    'messages_24h', (SELECT COUNT(*) FROM public.chat_messages WHERE created_at > now() - interval '24 hours'),
    'total_feedback', (SELECT COUNT(*) FROM public.message_feedback),
    'positive_feedback', (SELECT COUNT(*) FROM public.message_feedback WHERE feedback_type = 'up'),
    'negative_feedback', (SELECT COUNT(*) FROM public.message_feedback WHERE feedback_type = 'down')
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to list users for admin panel
CREATE OR REPLACE FUNCTION public.get_admin_users_list(p_limit INTEGER DEFAULT 50, p_offset INTEGER DEFAULT 0)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT json_agg(u) INTO result FROM (
    SELECT 
      au.id,
      au.email,
      au.raw_user_meta_data->>'full_name' as full_name,
      au.raw_user_meta_data->>'avatar_url' as avatar_url,
      au.created_at,
      au.last_sign_in_at,
      (SELECT COUNT(*) FROM public.chat_sessions cs WHERE cs.user_id = au.id) as session_count,
      (SELECT COUNT(*) FROM public.chat_messages cm 
       JOIN public.chat_sessions cs2 ON cm.session_id = cs2.id 
       WHERE cs2.user_id = au.id) as message_count,
      (SELECT role FROM public.user_roles ur WHERE ur.user_id = au.id LIMIT 1) as role
    FROM auth.users au
    ORDER BY au.created_at DESC
    LIMIT p_limit OFFSET p_offset
  ) u;

  RETURN COALESCE(result, '[]'::json);
END;
$$;
