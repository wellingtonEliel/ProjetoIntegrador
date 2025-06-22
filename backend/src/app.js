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

const frontendPath = path.join(__dirname, '../frontend');
console.log('Servindo arquivos estáticos de:', frontendPath);

// 🔽 Adicione isso para servir imagens corretamente
app.use('/imagens', express.static(path.join(frontendPath, 'imagens')));

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(frontendPath, 'cadastro.html'));
});

app.use((req, res, next) => {
  console.log('URL requisitada:', req.url);
  next();
});
app.use(express.static(frontendPath));

app.get(/^\/(?!api\/|.*\..*$)/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
