-- Security Fix Migration: Implement Proper Role-Based Access Control

-- 1. Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Create user_roles table with proper security
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Update is_admin function to use new role system
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- 5. Create RLS policies for user_roles table
CREATE POLICY "Admins can manage all user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 6. Migrate existing admin users to new roles table
INSERT INTO public.user_roles (user_id, role, assigned_at)
SELECT user_id, 'admin'::app_role, created_at
FROM public.profiles
WHERE role = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- 7. Remove role column from profiles table (security risk)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- 8. Update RLS policies for lead_sources (restrict to admin only)
DROP POLICY IF EXISTS "Authenticated users can manage lead sources" ON public.lead_sources;
CREATE POLICY "Only admins can manage lead sources"
ON public.lead_sources
FOR ALL
TO authenticated
USING (public.is_admin());

-- 9. Update RLS policies for lead_activities (admin or service role only)
DROP POLICY IF EXISTS "Authenticated users can insert activities" ON public.lead_activities;
CREATE POLICY "Only admins and service role can insert activities"
ON public.lead_activities
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin() OR 
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

-- 10. Update RLS policies for lead_scores (admin or service role only)
DROP POLICY IF EXISTS "Authenticated users can insert scores" ON public.lead_scores;
CREATE POLICY "Only admins and service role can insert scores"
ON public.lead_scores
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin() OR 
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

-- 11. Add audit logging trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Log role assignments/changes
    INSERT INTO public.lead_activities (
        lead_id,
        activity_type,
        title,
        description,
        created_by,
        metadata
    ) VALUES (
        NULL, -- No specific lead
        'system',
        'Role Assignment',
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'Role assigned: ' || NEW.role::text
            WHEN TG_OP = 'UPDATE' THEN 'Role changed from ' || OLD.role::text || ' to ' || NEW.role::text
            WHEN TG_OP = 'DELETE' THEN 'Role removed: ' || OLD.role::text
        END,
        COALESCE(NEW.assigned_by, OLD.assigned_by, auth.uid()),
        jsonb_build_object(
            'operation', TG_OP,
            'user_id', COALESCE(NEW.user_id, OLD.user_id),
            'role', COALESCE(NEW.role, OLD.role)
        )
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for role changes audit
CREATE TRIGGER audit_role_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.log_role_changes();

-- 12. Add validation trigger for user_roles
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Prevent self-assignment of admin role (except for service role)
    IF NEW.role = 'admin' AND NEW.user_id = auth.uid() AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Cannot self-assign admin role';
    END IF;
    
    -- Ensure assigned_by is set for admin assignments
    IF NEW.role = 'admin' AND NEW.assigned_by IS NULL THEN
        NEW.assigned_by := auth.uid();
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER validate_role_assignment_trigger
    BEFORE INSERT OR UPDATE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.validate_role_assignment();