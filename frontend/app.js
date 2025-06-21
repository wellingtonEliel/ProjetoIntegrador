// login.html
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const senha = e.target.password.value;

    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      window.location.href = 'index.html';
    } else {
      alert('Erro: ' + data.error);
    }
  });
}

// cadastro.html
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const nome = e.target.name.value;
    const email = e.target.email.value;
    const senha = e.target.password.value;

    const res = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Cadastro realizado!');
      window.location.href = 'login.html';
    } else {
      alert('Erro: ' + data.error);
    }
  });
}

// catalogo.html
if (document.getElementById('catalogo')) {
  (async () => {
    const res = await fetch('http://localhost:3000/api/produtos');
    const produtos = await res.json();
    const container = document.getElementById('catalogo');

    produtos.forEach(produto => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-2xl shadow-lg overflow-hidden';
      card.innerHTML = `
        <img src="https://via.placeholder.com/400x400.png?text=${encodeURIComponent(produto.nome)}" class="w-full h-56 object-cover">
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-2">${produto.nome}</h3>
          <p class="text-yellow-600 font-bold mb-4">R$ ${produto.preco}</p>
          <div class="flex justify-between">
            <a href="produtos.html?id=${produto.id}" class="text-sm bg-gray-800 text-white px-3 py-2 rounded-full">Detalhes</a>
            <a href="produtos.html?id=${produto.id}" class="text-sm bg-yellow-400 text-gray-900 px-3 py-2 rounded-full">Personalizar</a>
          </div>
        </div>`;
      container.appendChild(card);
    });
  })();
}

// produtos.html
if (location.pathname.includes('produtos.html')) {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  (async () => {
    const res = await fetch(`http://localhost:3000/api/produtos`);
    const produtos = await res.json();
    const produto = produtos.find(p => p.id == id);
    if (!produto) return;

    document.querySelector('h1').textContent = produto.nome;
    document.querySelector('p.text-yellow-600').textContent = `R$ ${produto.preco}`;

    document.querySelector('button').addEventListener('click', () => {
      const nome = document.querySelector('input[type=text]').value;
      const numero = document.querySelector('input[type=number]').value;
      const tamanho = document.querySelector('select').value;

      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      carrinho.push({ id_produto: id, quantidade: 1, nome_personalizado: nome, numero_personalizado: numero, tamanho });
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      alert('Adicionado ao carrinho!');
    });
  })();
}

// carrinho.html
if (location.pathname.includes('carrinho.html')) {
  (async () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const res = await fetch('http://localhost:3000/api/produtos');
    const produtos = await res.json();
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    carrinho.forEach(item => {
      const produto = produtos.find(p => p.id == item.id_produto);
      const subtotal = produto.preco * item.quantidade;
      tbody.innerHTML += `
        <tr class="border-b">
          <td class="px-4 py-3">${produto.nome}</td>
          <td class="px-4 py-3">${item.nome_personalizado} #${item.numero_personalizado}</td>
          <td class="px-4 py-3">R$ ${produto.preco}</td>
          <td class="px-4 py-3">${item.quantidade}</td>
          <td class="px-4 py-3">R$ ${subtotal.toFixed(2)}</td>
          <td class="px-4 py-3"><button onclick="remover(${item.id_produto})" class="text-red-500">Remover</button></td>
        </tr>`;
    });
  })();

  window.remover = function (id) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho = carrinho.filter(item => item.id_produto != id);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    location.reload();
  };
}

// pedido.html
if (location.pathname.includes('pedido.html')) {
  document.querySelector('button#finalizarPedido')?.addEventListener('click', async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const res = await fetch('http://localhost:3000/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario: usuario.id, itens: carrinho })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Pedido realizado!');
      localStorage.removeItem('carrinho');
      window.location.href = 'pedido.html';
    } else {
      alert('Erro: ' + data.error);
    }
  });
}
