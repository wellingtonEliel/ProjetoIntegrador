const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const produtoController = require('../controllers/produtoController');
const pedidoController = require('../controllers/pedidoController');



// Usuários
router.post('/usuarios', userController.createUser);
router.post('/login', userController.login);

// Produtos
router.get('/produtos', produtoController.getProdutos);
router.post('/produtos', produtoController.createProduto);
router.put('/produtos/:id', produtoController.updateProduto);
router.delete('/produtos/:id', produtoController.deleteProduto);

// Pedidos
router.post('/pedidos', pedidoController.criarPedido);
router.get('/pedidos', pedidoController.listarPedidos);
router.put('/pedidos/:id/status', pedidoController.atualizarStatus);

router.get('/produtos/:id', produtoController.buscarProdutoPorId);


module.exports = router;
