
INSERT INTO public.user_roles (user_id, role)
VALUES ('7993598d-fcd1-4f4f-87e4-bde15ff7df16', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
