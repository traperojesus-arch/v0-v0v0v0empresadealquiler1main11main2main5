# Sistema de Gestión de Alquiler de Equipos

Sistema completo para gestionar el alquiler de equipos con autenticación, gestión de clientes, pedidos, facturas y más.

## 🚀 Inicio Rápido

### Credenciales de Acceso

Para acceder al sistema por primera vez:

1. Ve a `/setup` para crear el usuario administrador
2. O usa las credenciales predeterminadas:
   - **Email:** `admin@empresa.com`
   - **Contraseña:** `admin123`

### Configuración Inicial

1. **Ejecutar Scripts SQL** (en orden):
   - `scripts/001_create_profiles_table.sql` - Crea la tabla de perfiles
   - `scripts/002_seed_test_user.sql` - Datos de prueba (opcional)
   - `scripts/003_setup_admin_user.sql` - Configura políticas RLS y triggers

2. **Crear Usuario Administrador**:
   - Opción A: Visita `/setup` y completa el formulario
   - Opción B: Usa el Dashboard de Supabase (Authentication > Users)

3. **Iniciar Sesión**:
   - Ve a `/login` e ingresa tus credenciales

## 📋 Características

- ✅ Autenticación con Supabase
- ✅ Gestión de artículos y stock
- ✅ Gestión de clientes
- ✅ Sistema de pedidos
- ✅ Generación de albaranes
- ✅ Facturación
- ✅ Sistema de cupones
- ✅ Horarios de operación
- ✅ Dashboard con estadísticas

## 🔧 Tecnologías

- Next.js 14 (App Router)
- Supabase (Auth + Database)
- TypeScript
- Tailwind CSS
- shadcn/ui

## 📁 Estructura del Proyecto

\`\`\`
app/
├── actions/          # Server actions
├── articulos/        # Gestión de artículos
├── clientes/         # Gestión de clientes
├── pedidos/          # Gestión de pedidos
├── facturas/         # Gestión de facturas
├── dashboard/        # Panel principal
├── login/            # Página de login
└── setup/            # Configuración inicial

components/
├── ui/               # Componentes de shadcn/ui
└── sidebar.tsx       # Navegación principal

lib/
└── supabase/         # Configuración de Supabase
    ├── client.ts     # Cliente para componentes
    ├── server.ts     # Cliente para server components
    └── middleware.ts # Utilidades de middleware

scripts/
└── *.sql             # Scripts de base de datos
\`\`\`

## 🔐 Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Autenticación mediante Supabase Auth
- Roles de usuario (admin/user)
- Middleware para proteger rutas

## 📝 Notas

- El sistema usa Supabase para autenticación y base de datos
- Todas las variables de entorno están configuradas automáticamente
- Los scripts SQL deben ejecutarse en orden numérico
