-- Datos iniciales para la plataforma de alquiler

-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre, descripcion) VALUES
('Mobiliario', 'Mesas, sillas, sofás y otros muebles para eventos'),
('Iluminación', 'Equipos de iluminación profesional y decorativa'),
('Sonido', 'Equipos de audio y sonido profesional'),
('Decoración', 'Elementos decorativos y ornamentales'),
('Catering', 'Equipos y utensilios para servicio de comida'),
('Tecnología', 'Equipos audiovisuales y tecnológicos');

-- Insertar horarios de operación por defecto (Lunes a Viernes 9:00-18:00)
INSERT INTO horarios_operacion (dia_semana, abierto, hora_inicio, hora_fin) VALUES
(1, true, '09:00', '18:00'), -- Lunes
(2, true, '09:00', '18:00'), -- Martes
(3, true, '09:00', '18:00'), -- Miércoles
(4, true, '09:00', '18:00'), -- Jueves
(5, true, '09:00', '18:00'), -- Viernes
(6, true, '09:00', '14:00'), -- Sábado (medio día)
(0, false, null, null);      -- Domingo cerrado

-- Insertar algunos artículos de ejemplo
WITH categoria_mobiliario AS (
  SELECT id FROM categorias WHERE nombre = 'Mobiliario' LIMIT 1
),
categoria_iluminacion AS (
  SELECT id FROM categorias WHERE nombre = 'Iluminación' LIMIT 1
)
INSERT INTO articulos (nombre, descripcion, subtitulo, categoria_id, cantidad_total, precio_por_dia, tipo_precio) VALUES
('Mesa Redonda 150cm', 'Mesa redonda de madera para 8 personas', 'Perfecta para eventos y celebraciones', (SELECT id FROM categoria_mobiliario), 10, 25.00, 'dia'),
('Silla Chiavari Dorada', 'Silla elegante estilo Chiavari en color dorado', 'Ideal para bodas y eventos formales', (SELECT id FROM categoria_mobiliario), 50, 8.00, 'dia'),
('Foco LED 200W', 'Foco LED profesional de alta potencia', 'Iluminación profesional para eventos', (SELECT id FROM categoria_iluminacion), 15, 35.00, 'dia');

-- Crear entidades individuales para los artículos
WITH articulo_mesa AS (
  SELECT id FROM articulos WHERE nombre = 'Mesa Redonda 150cm' LIMIT 1
),
articulo_silla AS (
  SELECT id FROM articulos WHERE nombre = 'Silla Chiavari Dorada' LIMIT 1
),
articulo_foco AS (
  SELECT id FROM articulos WHERE nombre = 'Foco LED 200W' LIMIT 1
)
INSERT INTO entidades_articulos (articulo_id, codigo_unico, estado, ubicacion) 
SELECT 
  (SELECT id FROM articulo_mesa),
  'MESA-' || LPAD(generate_series::text, 3, '0'),
  'disponible',
  'Almacén Principal'
FROM generate_series(1, 10)
UNION ALL
SELECT 
  (SELECT id FROM articulo_silla),
  'SILLA-' || LPAD(generate_series::text, 3, '0'),
  'disponible',
  'Almacén Principal'
FROM generate_series(1, 50)
UNION ALL
SELECT 
  (SELECT id FROM articulo_foco),
  'FOCO-' || LPAD(generate_series::text, 3, '0'),
  'disponible',
  'Almacén Técnico'
FROM generate_series(1, 15);

-- Insertar un cupón de ejemplo
INSERT INTO cupones (codigo, titulo, tipo_descuento, valor_descuento, activo) VALUES
('BIENVENIDO10', 'Descuento de Bienvenida', 'porcentaje', 10.00, true);
