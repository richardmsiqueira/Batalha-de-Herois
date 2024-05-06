const express = require('express');
const { Pool } = require('pg');
 
const app = express();
const PORT = 5000;

app.use (express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'batalha_herois', 
  password: 'ds564',
  port: 5432,
});

app.get('/' , (req, res) => {
    res.send('Servidor rodando perfeitamente 🎇✨');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}🚀`);
});
