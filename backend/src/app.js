const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes');
const path = require('path');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api', routes);

// Servir frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
