// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Configura la conexión a PostgreSQL usando variables de entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido por Render
  }
});

// Ejemplo: ruta para obtener proyectos desde t_proyectos
app.get('/proyectos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        tp.tipo_proyecto AS tipo_proyecto,
        p.nombre, 
        e.nombre_estado AS estado
        
      FROM t_proyectos p
      JOIN t_estados e ON p.id_estado = e.id
      JOIN t_tipos_proyecto tp ON p.id_tipo_proyecto = tp.id
      ORDER BY p.id;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener proyectos:', err);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

// Ruta simple de prueba
app.get('/ping', (req, res) => {
  res.send({ mensaje: 'Servidor funcionando' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
