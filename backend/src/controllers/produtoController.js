const db = require('../models/db');

exports.getProdutos = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM produtos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduto = async (req, res) => {
  const { nome, modelo, tamanho, preco, estoque } = req.body;
  try {
    await db.execute('INSERT INTO produtos (nome, modelo, tamanho, preco, estoque) VALUES (?, ?, ?, ?, ?)', [nome, modelo, tamanho, preco, estoque]);
    res.status(201).json({ message: 'Produto criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, modelo, tamanho, preco, estoque } = req.body;
  try {
    await db.execute('UPDATE produtos SET nome=?, modelo=?, tamanho=?, preco=?, estoque=? WHERE id=?', [nome, modelo, tamanho, preco, estoque, id]);
    res.json({ message: 'Produto atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduto = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM produtos WHERE id=?', [id]);
    res.json({ message: 'Produto excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

