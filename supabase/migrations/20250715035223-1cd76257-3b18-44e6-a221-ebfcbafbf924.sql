-- Create the app_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('buyer', 'seller', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Recreate the trigger function with proper dependencies
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
  );
  
  -- Insert user role based on user_type from metadata, default to buyer
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'buyer')::app_role
  );
  
  -- If user chose to be a seller, create a basic seller profile
  IF COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'buyer') = 'seller' THEN
    INSERT INTO public.seller_profiles (user_id, business_name, is_verified)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email) || '''s Store',
      false
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();