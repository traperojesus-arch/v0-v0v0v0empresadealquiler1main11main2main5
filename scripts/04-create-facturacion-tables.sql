-- Tabla de albaranes de entrega
CREATE TABLE IF NOT EXISTS albaranes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_albaran VARCHAR(50) UNIQUE NOT NULL,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_entrega DATE,
  estado VARCHAR(50) NOT NULL DEFAULT 'pendiente', -- pendiente, entregado, facturado
  direccion_entrega TEXT NOT NULL,
  observaciones TEXT,
  responsable_entrega VARCHAR(255),
  firma_cliente TEXT, -- URL de la firma digital
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS facturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_factura VARCHAR(50) UNIQUE NOT NULL,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  albaran_id UUID REFERENCES albaranes(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  iva DECIMAL(10, 2) NOT NULL DEFAULT 0,
  descuento DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  estado VARCHAR(50) NOT NULL DEFAULT 'pendiente', -- pendiente, pagada, vencida, cancelada
  metodo_pago VARCHAR(100),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de líneas de factura
CREATE TABLE IF NOT EXISTS lineas_factura (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factura_id UUID REFERENCES facturas(id) ON DELETE CASCADE,
  articulo_id UUID REFERENCES articulos(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  descuento DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factura_id UUID REFERENCES facturas(id) ON DELETE CASCADE,
  fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,
  monto DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(100) NOT NULL,
  referencia VARCHAR(255),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_albaranes_pedido ON albaranes(pedido_id);
CREATE INDEX IF NOT EXISTS idx_albaranes_estado ON albaranes(estado);
CREATE INDEX IF NOT EXISTS idx_facturas_pedido ON facturas(pedido_id);
CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON facturas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
CREATE INDEX IF NOT EXISTS idx_lineas_factura_factura ON lineas_factura(factura_id);
CREATE INDEX IF NOT EXISTS idx_pagos_factura ON pagos(factura_id);

-- Función para generar número de albarán automático
CREATE OR REPLACE FUNCTION generar_numero_albaran()
RETURNS VARCHAR(50) AS $$
DECLARE
  nuevo_numero VARCHAR(50);
  contador INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO contador FROM albaranes WHERE EXTRACT(YEAR FROM fecha_emision) = EXTRACT(YEAR FROM CURRENT_DATE);
  nuevo_numero := 'ALB-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(contador::TEXT, 4, '0');
  RETURN nuevo_numero;
END;
$$ LANGUAGE plpgsql;

-- Función para generar número de factura automático
CREATE OR REPLACE FUNCTION generar_numero_factura()
RETURNS VARCHAR(50) AS $$
DECLARE
  nuevo_numero VARCHAR(50);
  contador INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO contador FROM facturas WHERE EXTRACT(YEAR FROM fecha_emision) = EXTRACT(YEAR FROM CURRENT_DATE);
  nuevo_numero := 'FAC-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(contador::TEXT, 4, '0');
  RETURN nuevo_numero;
END;
$$ LANGUAGE plpgsql;

-- Habilitar RLS
ALTER TABLE albaranes ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE lineas_factura ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitir todo por ahora, ajustar según necesidades)
CREATE POLICY "Permitir todo en albaranes" ON albaranes FOR ALL USING (true);
CREATE POLICY "Permitir todo en facturas" ON facturas FOR ALL USING (true);
CREATE POLICY "Permitir todo en lineas_factura" ON lineas_factura FOR ALL USING (true);
CREATE POLICY "Permitir todo en pagos" ON pagos FOR ALL USING (true);
