-- Crear tablas para la plataforma de alquiler de artículos

-- Tabla de usuarios/clientes
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  empresa VARCHAR(200),
  id_fiscal VARCHAR(50),
  calle TEXT,
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(20),
  pais VARCHAR(100) DEFAULT 'España',
  direccion_secundaria TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías de artículos
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de artículos
CREATE TABLE IF NOT EXISTS articulos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  subtitulo VARCHAR(300),
  imagen_url TEXT,
  categoria_id UUID REFERENCES categorias(id),
  cantidad_total INTEGER NOT NULL DEFAULT 1,
  precio_por_metro DECIMAL(10,2),
  precio_por_hora DECIMAL(10,2),
  precio_por_dia DECIMAL(10,2),
  precio_por_dia_calendario DECIMAL(10,2),
  precio_por_noche DECIMAL(10,2),
  tipo_precio VARCHAR(50) DEFAULT 'dia', -- metro, hora, dia, dia_calendario, noche
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de entidades individuales de artículos (para tracking individual)
CREATE TABLE IF NOT EXISTS entidades_articulos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  articulo_id UUID REFERENCES articulos(id) ON DELETE CASCADE,
  codigo_unico VARCHAR(50) UNIQUE NOT NULL,
  estado VARCHAR(50) DEFAULT 'disponible', -- disponible, alquilado, mantenimiento, dañado
  ubicacion VARCHAR(200),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pedidos/reservas
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_pedido VARCHAR(50) UNIQUE NOT NULL,
  usuario_id UUID REFERENCES usuarios(id),
  estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, confirmado, en_servicio, completado, cancelado
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  ubicacion_recogida VARCHAR(300),
  ubicacion_entrega VARCHAR(300),
  medio_transporte VARCHAR(100),
  horario_recogida TIME,
  horario_entrega TIME,
  km_transporte INTEGER,
  coste_transporte DECIMAL(10,2),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  iva DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de items del pedido
CREATE TABLE IF NOT EXISTS items_pedido (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  articulo_id UUID REFERENCES articulos(id),
  entidad_articulo_id UUID REFERENCES entidades_articulos(id),
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cupones/descuentos
CREATE TABLE IF NOT EXISTS cupones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  titulo VARCHAR(200),
  tipo_descuento VARCHAR(20) DEFAULT 'porcentaje', -- porcentaje, fijo
  valor_descuento DECIMAL(10,2) NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  periodo_tiempo_inicio TIME,
  periodo_tiempo_fin TIME,
  dias_semana INTEGER[], -- array de días (0=domingo, 1=lunes, etc.)
  usos_maximos INTEGER,
  usos_actuales INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de horarios de operación
CREATE TABLE IF NOT EXISTS horarios_operacion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dia_semana INTEGER NOT NULL, -- 0=domingo, 1=lunes, etc.
  abierto BOOLEAN DEFAULT true,
  hora_inicio TIME,
  hora_fin TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de excepciones de horarios (días festivos, vacaciones)
CREATE TABLE IF NOT EXISTS excepciones_horarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha DATE NOT NULL,
  descripcion VARCHAR(200),
  cerrado BOOLEAN DEFAULT true,
  hora_inicio TIME,
  hora_fin TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_articulos_categoria ON articulos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_entidades_articulo ON entidades_articulos(articulo_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_fechas ON pedidos(fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_items_pedido ON items_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_cupones_codigo ON cupones(codigo);
