-- scripts/06-auth-setup.sql

-- 1. Crear un tipo ENUM para los roles de usuario
-- Esto asegura que solo los valores definidos puedan ser asignados a los roles.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'premium', 'standard');
    END IF;
END$$;

-- 2. Crear la tabla de perfiles (profiles)
-- Esta tabla almacenará información adicional del usuario, incluyendo su rol.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role user_role DEFAULT 'standard' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 3. Función para crear un perfil automáticamente al registrar un nuevo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'standard');
  RETURN new;
END;
$$;

-- 4. Trigger para ejecutar la función handle_new_user() en cada nuevo registro
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Habilitar la Seguridad a Nivel de Fila (RLS) en la tabla de perfiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de RLS para la tabla de perfiles
DROP POLICY IF EXISTS "Los perfiles son visibles para todos los usuarios." ON public.profiles;
CREATE POLICY "Los perfiles son visibles para todos los usuarios."
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil." ON public.profiles;
CREATE POLICY "Los usuarios pueden actualizar su propio perfil."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Los administradores tienen acceso total." ON public.profiles;
CREATE POLICY "Los administradores tienen acceso total."
  ON public.profiles FOR ALL
  USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' )
  WITH CHECK ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- Nota: Para que un usuario sea 'admin', deberás actualizar su rol manualmente
-- desde el panel de Supabase o mediante una función de servidor segura.
-- Ejemplo: UPDATE public.profiles SET role = 'admin' WHERE id = 'tu-user-id';
