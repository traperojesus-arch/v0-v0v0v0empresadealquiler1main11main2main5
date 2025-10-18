-- Crear tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL UNIQUE,
  contacto VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(255),
  direccion TEXT,
  cif VARCHAR(50),
  notas TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_proveedores_nombre ON proveedores(nombre);
CREATE INDEX IF NOT EXISTS idx_proveedores_activo ON proveedores(activo);

-- Insertar algunos proveedores de ejemplo
INSERT INTO proveedores (nombre, contacto, telefono, email) VALUES
  ('Muebles García S.L.', 'Juan García', '912345678', 'info@mueblesgarcia.com'),
  ('Eventos Pro', 'María López', '923456789', 'ventas@eventospro.com'),
  ('Iluminación Total', 'Pedro Martínez', '934567890', 'contacto@iluminaciontotal.com')
ON CONFLICT (nombre) DO NOTHING;
