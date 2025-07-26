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
  ssl: { rejectUnauthorized: false } // Railway usa SSL
});

// Ruta de prueba
app.get('/ping', (req, res) => {
  res.json({ message: 'Servidor funcionando 🚀' });
});

// Ruta ejemplo para traer datos
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
