const db = require('../models/db');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  const { nome, email, senha } = req.body;
  console.log('Recebido no req.body:', req.body); 

  try {
    const hashed = await bcrypt.hash(senha, 10);
    await db.execute(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, hashed, 'cliente']
    );
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ error: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(senha, rows[0].senha);
    if (!valid) return res.status(400).json({ error: 'Senha inválida' });

    console.log('Login sucesso, usuário:', rows[0]); // <-- coloque isso para depurar

    res.json({ message: 'Login realizado com sucesso', usuario: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};