# Credenciales de Acceso

## Usuario de Prueba

Para acceder al sistema, necesitas crear un usuario en Supabase Auth.

### Opción 1: Crear usuario manualmente en Supabase Dashboard

1. Ve a tu proyecto de Supabase
2. Navega a Authentication > Users
3. Haz clic en "Add user"
4. Usa estas credenciales:
   - **Email:** `admin@empresa.com`
   - **Password:** `admin123`
5. Después de crear el usuario, ejecuta este SQL en el SQL Editor:

\`\`\`sql
UPDATE public.profiles 
SET role = 'admin', full_name = 'Administrador'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@empresa.com');
\`\`\`

### Opción 2: Usar la API de Supabase (Recomendado para desarrollo)

Puedes crear el usuario programáticamente usando el Service Role Key:

\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key, not anon key
)

const { data, error } = await supabase.auth.admin.createUser({
  email: 'admin@empresa.com',
  password: 'admin123',
  email_confirm: true,
  user_metadata: {
    full_name: 'Administrador',
    role: 'admin'
  }
})
\`\`\`

### Credenciales de Acceso

Una vez creado el usuario:

- **Email:** `admin@empresa.com`
- **Contraseña:** `admin123`
- **Rol:** Admin (acceso completo)

## Roles Disponibles

- **admin**: Acceso completo a todas las funciones
- **premium**: Acceso a facturación e informes
- **standard**: Acceso básico al sistema

## Notas de Seguridad

⚠️ **IMPORTANTE:** Estas son credenciales de prueba. En producción:
- Cambia la contraseña inmediatamente
- Usa contraseñas seguras
- Habilita autenticación de dos factores si está disponible
- No compartas las credenciales de admin
