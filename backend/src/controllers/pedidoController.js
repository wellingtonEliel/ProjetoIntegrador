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
  const id_usuario = req.query.id_usuario;

  if (id_usuario) {
    // Se id_usuario estiver presente, chama listarPedidosPorUsuario
    return exports.listarPedidosPorUsuario(req, res);
  }

  // Se não, lista todos os pedidos normalmente
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id, p.id_usuario, p.data, p.status, u.nome AS nome_cliente,
        i.quantidade, i.nome_personalizado, i.numero_personalizado,
        pr.nome AS produto_nome, pr.imagem AS arquivo, pr.preco
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id
      JOIN itens_pedido i ON i.id_pedido = p.id
      JOIN produtos pr ON pr.id = i.id_produto
      ORDER BY p.id, i.id
    `);

    const pedidos = [];
    const map = {};
    rows.forEach(r => {
      if (!map[r.id]) {
        map[r.id] = {
          id: r.id,
          id_usuario: r.id_usuario,
          nome_cliente: r.nome_cliente,
          status: r.status,
          itens: [],
          total: 0
        };
        pedidos.push(map[r.id]);
      }

      const pedido = map[r.id];
      const valorUnitario = parseFloat(r.preco) || 0;
      pedido.total += valorUnitario * r.quantidade;

      pedido.itens.push({
        nome: r.produto_nome,
        quantidade: r.quantidade,
        nome_personalizado: r.nome_personalizado,
        numero_personalizado: r.numero_personalizado,
        arquivo: r.arquivo,
        preco: valorUnitario
      });
    });

    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.execute('UPDATE pedidos SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarPedidosPorUsuario = async (req, res) => {
  const id_usuario = req.query.id_usuario;

  if (!id_usuario) {
    return res.status(400).json({ error: "id_usuario é obrigatório" });
  }

  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id, p.id_usuario, p.data, p.status, u.nome AS nome_cliente,
        i.quantidade, i.nome_personalizado, i.numero_personalizado,
        pr.nome AS produto_nome, pr.imagem AS arquivo, pr.preco
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id
      JOIN itens_pedido i ON i.id_pedido = p.id
      JOIN produtos pr ON pr.id = i.id_produto
      WHERE p.id_usuario = ?
      ORDER BY p.id, i.id
    `, [id_usuario]);

    // Aqui você já tem apenas os pedidos do usuário

    // Organiza os pedidos como antes
    const pedidos = [];
    const map = {};
    rows.forEach(r => {
      if (!map[r.id]) {
        map[r.id] = {
          id: r.id,
          id_usuario: r.id_usuario,
          nome_cliente: r.nome_cliente,
          status: r.status,
          data: r.data,
          itens: [],
          total: 0
        };
        pedidos.push(map[r.id]);
      }

      const pedido = map[r.id];
      const valorUnitario = parseFloat(r.preco) || 0;
      pedido.total += valorUnitario * r.quantidade;

      pedido.itens.push({
        nome: r.produto_nome,
        quantidade: r.quantidade,
        nome_personalizado: r.nome_personalizado,
        numero_personalizado: r.numero_personalizado,
        arquivo: r.arquivo,
        preco: valorUnitario
      });
    });

    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

