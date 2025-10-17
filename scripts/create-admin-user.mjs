import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const email = 'admin@empresa.com'
  const password = 'admin123'
  
  console.log('🔄 Creando usuario administrador...')
  console.log(`📧 Email: ${email}`)
  
  try {
    // Primero verificar si el usuario ya existe
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Error al listar usuarios:', listError.message)
      process.exit(1)
    }
    
    const existingUser = existingUsers.users.find(u => u.email === email)
    
    if (existingUser) {
      console.log('⚠️  El usuario ya existe. Actualizando contraseña...')
      
      // Actualizar la contraseña del usuario existente
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: password }
      )
      
      if (updateError) {
        console.error('❌ Error al actualizar usuario:', updateError.message)
        process.exit(1)
      }
      
      console.log('✅ Contraseña actualizada exitosamente')
      console.log(`\n🎉 Puedes iniciar sesión con:`)
      console.log(`   Email: ${email}`)
      console.log(`   Contraseña: ${password}`)
      return
    }
    
    // Crear nuevo usuario
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        nombre: 'Administrador',
        rol: 'admin'
      }
    })
    
    if (error) {
      console.error('❌ Error al crear usuario:', error.message)
      process.exit(1)
    }
    
    console.log('✅ Usuario creado exitosamente')
    console.log(`   ID: ${data.user.id}`)
    
    // Crear perfil en la tabla profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: email,
        nombre: 'Administrador',
        rol: 'admin'
      })
    
    if (profileError) {
      console.log('⚠️  Advertencia: No se pudo crear el perfil (puede que ya exista o la tabla no esté creada)')
      console.log('   Error:', profileError.message)
    } else {
      console.log('✅ Perfil creado exitosamente')
    }
    
    console.log(`\n🎉 ¡Todo listo! Puedes iniciar sesión con:`)
    console.log(`   Email: ${email}`)
    console.log(`   Contraseña: ${password}`)
    
  } catch (err) {
    console.error('❌ Error inesperado:', err.message)
    process.exit(1)
  }
}

createAdminUser()
