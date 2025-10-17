-- Actualizar esquema de base de datos para coincidir con el código actual

-- Eliminar tablas antiguas si existen
DROP TABLE IF EXISTS items_pedido CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS entidades_articulos CASCADE;
DROP TABLE IF EXISTS articulos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Tabla de usuarios/clientes actualizada
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  empresa VARCHAR(200),
  nif VARCHAR(50),
  calle TEXT,
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(20),
  pais VARCHAR(100) DEFAULT 'España',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de artículos actualizada
CREATE TABLE articulos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  categoria VARCHAR(100),
  descripcion TEXT,
  precio_dia DECIMAL(10,2) NOT NULL,
  stock_total INTEGER NOT NULL DEFAULT 1,
  stock_disponible INTEGER NOT NULL DEFAULT 1,
  imagenes TEXT[],
  coste_compra DECIMAL(10,2),
  fecha_compra DATE,
  proveedor VARCHAR(200),
  amortizacion DECIMAL(10,2) DEFAULT 0,
  veces_alquilado INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pedidos/reservas actualizada
CREATE TABLE pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_pedido VARCHAR(50) UNIQUE NOT NULL,
  cliente_id UUID REFERENCES usuarios(id),
  cliente_nombre VARCHAR(200),
  cliente_email VARCHAR(255),
  cliente_telefono VARCHAR(20),
  cliente_empresa VARCHAR(200),
  cliente_nif VARCHAR(50),
  fecha_pedido TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  fecha_entrega TIMESTAMP WITH TIME ZONE,
  calle TEXT,
  codigo_postal VARCHAR(20),
  ciudad VARCHAR(100),
  estado VARCHAR(50) DEFAULT 'pendiente',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  iva DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de items del pedido actualizada
CREATE TABLE items_pedido (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  articulo_id UUID REFERENCES articulos(id),
  articulo_codigo VARCHAR(50),
  articulo_nombre VARCHAR(200),
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_articulos_codigo ON articulos(codigo);
CREATE INDEX idx_articulos_categoria ON articulos(categoria);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_fechas ON pedidos(fecha_inicio, fecha_fin);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_items_pedido ON items_pedido(pedido_id);
CREATE INDEX idx_items_articulo ON items_pedido(articulo_id);

-- Insertar algunos artículos de ejemplo
INSERT INTO articulos (codigo, nombre, categoria, descripcion, precio_dia, stock_total, stock_disponible, imagenes, coste_compra, proveedor)
VALUES
  ('SIL-001', 'Silla Chiavari Dorada', 'mobiliario', 'Elegante silla dorada tipo Chiavari para eventos', 5.50, 100, 100, ARRAY['/silla-chiavari-dorada.jpg'], 45.00, 'Mobiliario Pro'),
  ('MES-001', 'Mesa Redonda Madera', 'mobiliario', 'Mesa redonda de madera para 8 personas', 25.00, 20, 20, ARRAY['/mesa-redonda-madera.jpg'], 180.00, 'Muebles García'),
  ('FOC-001', 'Foco LED Profesional', 'iluminacion', 'Foco LED de alta potencia para eventos', 15.00, 50, 50, ARRAY['/foco-led-profesional.jpg'], 120.00, 'Iluminación Total');

-- Insertar algunos clientes de ejemplo
INSERT INTO usuarios (nombre, apellido, email, telefono, empresa, nif, calle, ciudad, codigo_postal)
VALUES
  ('Juan', 'García', 'juan.garcia@email.com', '612345678', 'Eventos García SL', 'B12345678', 'Calle Mayor 123', 'Madrid', '28001'),
  ('María', 'López', 'maria.lopez@email.com', '623456789', 'Bodas Perfectas', 'B23456789', 'Avenida Principal 45', 'Barcelona', '08001'),
  ('Carlos', 'Martínez', 'carlos.martinez@email.com', '634567890', NULL, '12345678A', 'Plaza España 7', 'Valencia', '46001');
