------------------------------------------------------
-- Global Functions
------------------------------------------------------
CREATE OR REPLACE FUNCTION user_tenant_id()
RETURNS UUID
AS $$
DECLARE
  tenant UUID;
BEGIN
  SELECT tenant_id
  INTO tenant
  FROM public.users
  WHERE auth.uid() = id;
  
  RETURN tenant;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

------

CREATE OR REPLACE FUNCTION user_role()
RETURNS TEXT
AS $$
DECLARE
  role_type TEXT;
BEGIN
  SELECT role
  INTO role_type
  FROM public.users
  WHERE auth.uid() = id;
  
  RETURN role_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

------------------------------------------------------
-- Tenants
------------------------------------------------------
-- Create table
create table public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
  created_at timestamp with time zone null default (NOW()),
  stripe_customer_id TEXT NULL,
  onboarded BOOLEAN NOT NULL DEFAULT FALSE
);

-- Enable RLS
alter table tenants
  enable row level security;

-- RLS Policies
create policy "tenants - select"
  ON tenants FOR SELECT
  TO authenticated
  USING ((SELECT user_tenant_id()) = id);

------------------------------------------------------
-- API Keys
------------------------------------------------------
-- Create table
CREATE TABLE public.api_keys (
  id TEXT DEFAULT gen_random_uuid () PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW()),
  last_used_at TIMESTAMP WITH TIME ZONE,
  key TEXT NOT NULL,
  key_partial TEXT NOT NULL,
  name TEXT NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE api_keys
  ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "api_keys - select"
  ON api_keys FOR SELECT
  TO authenticated
  USING (user_tenant_id() = tenant_id);

CREATE POLICY "api_keys - insert"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (user_tenant_id() = tenant_id);

CREATE POLICY "api_keys - delete"
  ON api_keys FOR DELETE
  TO authenticated
  USING (user_tenant_id() = tenant_id);

-- Functions & Triggers
CREATE OR REPLACE FUNCTION create_key(length INT, key_name TEXT, tenant UUID) RETURNS TEXT AS $$
DECLARE
    chars TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    key BYTEA := gen_random_bytes(length);
    result TEXT := '';
    i INT;
    byte INT;
    api_key TEXT;
    last_4_chars TEXT;
    partial_key TEXT;
BEGIN
    FOR i IN 0..(length - 1) LOOP
        byte := get_byte(key, i) % 62 + 1;
        result := result || substr(chars, byte, 1);
    END LOOP;

    api_key := 'sk_' || result;
    last_4_chars := RIGHT(api_key, 4);
    partial_key := 'sk...' || last_4_chars;

    INSERT INTO api_keys (key, key_partial, name, tenant_id)
    VALUES (crypt(api_key, gen_salt('bf')), partial_key, key_name, tenant);

    RETURN api_key;
END;
$$ LANGUAGE plpgsql;

------

CREATE OR REPLACE FUNCTION validate_key(api_key TEXT) RETURNS UUID AS $$
DECLARE
  tenant UUID := NULL;
BEGIN
  SELECT tenant_id
  INTO tenant
  FROM public.api_keys
  WHERE key = crypt(api_key, key);

  RETURN tenant;

END;
$$ LANGUAGE plpgsql;

------------------------------------------------------
-- Users
------------------------------------------------------
-- Create table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  pending BOOLEAN NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE
);

-- Enable RLS
alter table users
  enable row level security;

-- RLS Policies
create policy "users - select"
  ON users FOR SELECT
  TO authenticated
  USING (user_tenant_id() = tenant_id);

-- Functions & Triggers
CREATE FUNCTION new_signup()
RETURNS trigger AS $$
DECLARE
  tenant_id UUID;
  role_type TEXT;
BEGIN
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    IF NEW.raw_user_meta_data ? 'tenant_id' AND NEW.raw_user_meta_data ? 'role' THEN
      tenant_id := (NEW.raw_user_meta_data->>'tenant_id')::UUID;
      role_type := (NEW.raw_user_meta_data->>'role')::TEXT;
      --
      UPDATE public.users SET pending = false, joined_at = NEW.email_confirmed_at WHERE id = NEW.id;
    ELSE
      role_type := 'owner';
      --
      INSERT INTO public.tenants DEFAULT VALUES RETURNING id INTO tenant_id;
      --
      NEW.raw_user_meta_data := NEW.raw_user_meta_data || jsonb_build_object('tenant_id', tenant_id, 'role', role_type);
      --
      INSERT INTO public.users (id, email, role, name, avatar_url, pending, joined_at, tenant_id)
      VALUES (NEW.id, NEW.email, role_type, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', false, NEW.email_confirmed_at, tenant_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

create trigger new_signup_trigger
  before update on auth.users
  for each row execute procedure public.new_signup();

------

CREATE FUNCTION update_user()
RETURNS trigger AS $$
BEGIN
  IF OLD.email != NEW.email THEN
    UPDATE public.users SET email = NEW.email WHERE id = NEW.id;
  END IF;

  IF OLD.raw_app_meta_data->>'role' != NEW.raw_app_meta_data->>'role' THEN
    UPDATE public.users SET role = NEW.raw_app_meta_data->>'role' WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

create trigger update_user_trigger
  after update on auth.users
  for each row execute procedure public.update_user();

------------------------------------------------------
-- Subscriptions
------------------------------------------------------
-- Create table
CREATE TABLE public.subscriptions (
  id TEXT PRIMARY KEY,
  created_at timestamp with time zone null default (NOW()),
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  item_id TEXT NOT NULL,
  price_id TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE
);

-- Enable RLS
alter table subscriptions
  enable row level security;

-- RLS Policies
create policy "subscriptions - select"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_tenant_id() = tenant_id);

------------------------------------------------------
-- Metrics
------------------------------------------------------
-- Create table
CREATE TABLE public.metrics (
  id TEXT DEFAULT gen_random_uuid () PRIMARY KEY,
  name TEXT NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE metrics
  ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "metrics - select"
  ON metrics FOR SELECT
  TO authenticated
  USING (user_tenant_id() = tenant_id);

------------------------------------------------------
-- Metric Logs
------------------------------------------------------
