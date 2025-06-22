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
  let { nome, modelo, tamanho, preco, estoque, imagem } = req.body;

  modelo = modelo !== undefined ? modelo : null;
  tamanho = tamanho !== undefined ? tamanho : null;
  preco = preco !== undefined ? preco : null;
  estoque = estoque !== undefined ? estoque : null;
  imagem = imagem !== undefined ? imagem : null;

  if (!nome || preco === null) {
    return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
  }

  try {
    await db.execute(
      'INSERT INTO produtos (nome, modelo, tamanho, preco, estoque, imagem) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, modelo, tamanho, preco, estoque, imagem]
    );
    res.status(201).json({ message: 'Produto criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduto = async (req, res) => {
  const { id } = req.params;
  let { nome, modelo, tamanho, preco, estoque, imagem } = req.body;

  modelo = modelo !== undefined ? modelo : null;
  tamanho = tamanho !== undefined ? tamanho : null;
  preco = preco !== undefined ? preco : null;
  estoque = estoque !== undefined ? estoque : null;
  imagem = imagem !== undefined ? imagem : null;

  if (!nome || preco === null) {
    return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE produtos SET nome=?, modelo=?, tamanho=?, preco=?, estoque=?, imagem=? WHERE id=?',
      [nome, modelo, tamanho, preco, estoque, imagem, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.json({ message: 'Produto atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM produtos WHERE id=?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.json({ message: 'Produto excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
