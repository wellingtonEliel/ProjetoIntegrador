// login.html
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const senha = e.target.password.value.trim();

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        window.location.href = 'index.html';
      } else {
        alert('Erro: ' + (data.error || 'Falha ao efetuar login'));
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  });
}

// cadastro.html
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.password.value.trim();

    try {
      const res = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Cadastro realizado!');
        window.location.href = 'login.html';
      } else {
        alert('Erro: ' + (data.error || 'Falha no cadastro'));
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  });
}

// catalogo.html
if (document.getElementById('catalogo')) {
  (async () => {
    try {
      const res = await fetch('http://localhost:3000/api/produtos');
      const produtos = await res.json();
      const container = document.getElementById('catalogo');

      // Limpa o container antes
      container.innerHTML = '';

      // Filtra só os produtos com estoque > 0
      const produtosDisponiveis = produtos.filter(p => {
        // Pode adaptar se quiser aceitar estoque nulo ou indefinido como 0
        return p.estoque && p.estoque > 0;
      });

      if (produtosDisponiveis.length === 0) {
        container.innerHTML = '<p class="text-center col-span-full">Nenhum produto disponível no momento.</p>';
        return;
      }

      produtosDisponiveis.forEach((produto) => {
        const precoNum = Number(produto.preco);
        const precoFormatado = isNaN(precoNum)
          ? 'Preço indisponível'
          : `R$ ${precoNum.toFixed(2).replace('.', ',')}`;

        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl shadow-lg overflow-hidden';
        card.innerHTML = `
          <img src="https://via.placeholder.com/400x400.png?text=${encodeURIComponent(produto.nome)}" class="w-full h-56 object-cover" alt="${produto.nome}">
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2">${produto.nome}</h3>
            <p class="text-yellow-600 font-bold mb-4">${precoFormatado}</p>
            <div class="flex justify-between">
              <a href="produtos.html?id=${produto.id}" class="text-sm bg-gray-800 text-white px-3 py-2 rounded-full">Detalhes</a>
              <a href="produtos.html?id=${produto.id}" class="text-sm bg-yellow-400 text-gray-900 px-3 py-2 rounded-full">Personalizar</a>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  })();
}

// produtos.html
if (location.pathname.includes('produtos.html')) {
  (async () => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (!id) return;

    try {
      const res = await fetch('http://localhost:3000/api/produtos');
      const produtos = await res.json();
      const produto = produtos.find(p => p.id == id);
      if (!produto) return;

      const titulo = document.querySelector('h1');
      const precoElem = document.querySelector('p.text-yellow-600');
      const btnAdicionar = document.querySelector('button');

      if (titulo) titulo.textContent = produto.nome;
      if (precoElem) precoElem.textContent = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;

      if (btnAdicionar) {
        btnAdicionar.addEventListener('click', () => {
          const nomePersonalizado = document.querySelector('input[type=text]').value.trim();
          const numeroPersonalizado = document.querySelector('input[type=number]').value.trim();
          const tamanho = document.querySelector('select').value;

          if (!nomePersonalizado || !numeroPersonalizado) {
            alert('Por favor, preencha o nome e o número personalizados.');
            return;
          }

          const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
          carrinho.push({
            id_produto: id,
            quantidade: 1,
            nome_personalizado: nomePersonalizado,
            numero_personalizado: numeroPersonalizado,
            tamanho,
          });
          localStorage.setItem('carrinho', JSON.stringify(carrinho));
          alert('Adicionado ao carrinho!');
        });
      }
    } catch (err) {
      console.error('Erro ao carregar produto:', err);
    }
  })();
}

// carrinho.html
if (location.pathname.includes('carrinho.html')) {
  (async () => {
    try {
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      const res = await fetch('http://localhost:3000/api/produtos');
      const produtos = await res.json();
      const tbody = document.querySelector('tbody');
      if (!tbody) return;
      tbody.innerHTML = '';

      carrinho.forEach(item => {
        const produto = produtos.find(p => p.id == item.id_produto);
        if (!produto) return;

        const subtotal = produto.preco * item.quantidade;
        const tr = document.createElement('tr');
        tr.className = 'border-b';
        tr.innerHTML = `
          <td class="px-4 py-3">${produto.nome}</td>
          <td class="px-4 py-3">${item.nome_personalizado} #${item.numero_personalizado}</td>
          <td class="px-4 py-3">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
          <td class="px-4 py-3">${item.quantidade}</td>
          <td class="px-4 py-3">R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
          <td class="px-4 py-3"><button data-id="${item.id_produto}" class="remover text-red-500">Remover</button></td>
        `;
        tbody.appendChild(tr);
      });

      tbody.querySelectorAll('button.remover').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
          carrinho = carrinho.filter(item => item.id_produto != id);
          localStorage.setItem('carrinho', JSON.stringify(carrinho));
          location.reload();
        });
      });
    } catch (err) {
      console.error('Erro ao carregar carrinho:', err);
    }
  })();
}

// pedido.html
if (location.pathname.includes('pedido.html')) {
  const btnFinalizar = document.querySelector('button#finalizarPedido');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', async () => {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      if (!usuario) {
        alert('Você precisa estar logado para finalizar o pedido.');
        window.location.href = 'login.html';
        return;
      }
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      if (carrinho.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_usuario: usuario.id, itens: carrinho }),
        });

        const data = await res.json();

        if (res.ok) {
          alert('Pedido realizado!');
          localStorage.removeItem('carrinho');
          window.location.href = 'pedido.html';
        } else {
          alert('Erro: ' + (data.error || 'Falha ao realizar pedido'));
        }
      } catch (err) {
        alert('Erro de conexão: ' + err.message);
      }
    });
  }
}
