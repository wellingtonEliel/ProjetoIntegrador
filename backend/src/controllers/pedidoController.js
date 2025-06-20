const db = require('../models/db');

exports.criarPedido = async (req, res) => {
  const { id_usuario, itens } = req.body;
  try {
    const [pedido] = await db.execute('INSERT INTO pedidos (id_usuario, data, status) VALUES (?, NOW(), ?)', [id_usuario, 'aguardando envio']);
    const id_pedido = pedido.insertId;

    for (const item of itens) {
      await db.execute(`INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, nome_personalizado, numero_personalizado) VALUES (?, ?, ?, ?, ?)`,
        [id_pedido, item.id_produto, item.quantidade, item.nome_personalizado, item.numero_personalizado]);
    }

    res.status(201).json({ message: 'Pedido criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarPedidos = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pedidos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};