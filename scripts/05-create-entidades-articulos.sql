-- Asegurar que la tabla de entidades individuales existe
CREATE TABLE IF NOT EXISTS entidades_articulos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  articulo_id UUID REFERENCES articulos(id) ON DELETE CASCADE,
  codigo_unico VARCHAR(50) UNIQUE NOT NULL,
  estado VARCHAR(50) DEFAULT 'disponible', -- disponible, alquilado, mantenimiento, dañado
  ubicacion VARCHAR(200),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_entidades_articulo ON entidades_articulos(articulo_id);
CREATE INDEX IF NOT EXISTS idx_entidades_codigo ON entidades_articulos(codigo_unico);
CREATE INDEX IF NOT EXISTS idx_entidades_estado ON entidades_articulos(estado);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_entidades_articulos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_entidades_articulos_updated_at
  BEFORE UPDATE ON entidades_articulos
  FOR EACH ROW
  EXECUTE FUNCTION update_entidades_articulos_updated_at();
