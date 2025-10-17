-- Agregar campos de coste y amortización a la tabla artículos
ALTER TABLE articulos 
ADD COLUMN IF NOT EXISTS coste_compra DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS fecha_compra DATE,
ADD COLUMN IF NOT EXISTS amortizacion_total DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS veces_alquilado INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS codigo_prefijo VARCHAR(10) DEFAULT 'ART';

-- Crear tabla de historial de artículos
CREATE TABLE IF NOT EXISTS historial_articulos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  articulo_id UUID REFERENCES articulos(id) ON DELETE CASCADE,
  entidad_articulo_id UUID REFERENCES entidades_articulos(id),
  tipo_evento VARCHAR(50) NOT NULL, -- compra, alquiler_inicio, alquiler_fin, mantenimiento, reparacion
  descripcion TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  pedido_id UUID REFERENCES pedidos(id),
  fecha_evento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  importe DECIMAL(10,2),
  estado_anterior VARCHAR(50),
  estado_nuevo VARCHAR(50),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para el historial
CREATE INDEX IF NOT EXISTS idx_historial_articulo ON historial_articulos(articulo_id);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial_articulos(fecha_evento);
CREATE INDEX IF NOT EXISTS idx_historial_tipo ON historial_articulos(tipo_evento);

-- Función para actualizar amortización automáticamente
CREATE OR REPLACE FUNCTION actualizar_amortizacion()
RETURNS TRIGGER AS $$
BEGIN
  -- Si es un evento de alquiler completado, actualizar amortización
  IF NEW.tipo_evento = 'alquiler_fin' AND NEW.importe IS NOT NULL THEN
    UPDATE articulos 
    SET 
      amortizacion_total = COALESCE(amortizacion_total, 0) + NEW.importe,
      veces_alquilado = COALESCE(veces_alquilado, 0) + 1
    WHERE id = NEW.articulo_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar amortización
DROP TRIGGER IF EXISTS trigger_actualizar_amortizacion ON historial_articulos;
CREATE TRIGGER trigger_actualizar_amortizacion
  AFTER INSERT ON historial_articulos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_amortizacion();
