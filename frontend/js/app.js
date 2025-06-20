// Exemplo: login
async function login(email, senha) {
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  return await res.json();
}

// Exemplo: cadastro
async function cadastrar(nome, email, senha) {
  const res = await fetch('http://localhost:3000/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  });
  return await res.json();
}

// Exemplo: listar produtos
async function listarProdutos() {
  const res = await fetch('http://localhost:3000/api/produtos');
  return await res.json();
}

// Exemplo: criar pedido
async function criarPedido(id_usuario, itens) {
  const res = await fetch('http://localhost:3000/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_usuario, itens })
  });
  return await res.json();
}
