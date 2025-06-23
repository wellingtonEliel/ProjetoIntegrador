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
        if (data.usuario.email === 'admin@admin.admin') {
          window.location.href = 'admin.html'; // redireciona para painel admin
        } else {
          window.location.href = 'index.html'; // redireciona para home do cliente
        }
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
      console.log('Produtos recebidos do backend:', produtos);
      const produtosDisponiveis = produtos.filter(p => {
        const estoque = parseInt(p.estoque) || 0;
        return estoque > 0;
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

        // Monta caminho completo da imagem
        const imagemSrc = `/imagens/${produto.imagem}`;

        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl shadow-lg overflow-hidden';
        card.innerHTML = `
            <img src="${imagemSrc}" class="w-full h-80 object-cover" alt="${produto.nome}">
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-2">${produto.nome}</h3>
              <p class="text-yellow-600 font-bold mb-4">${precoFormatado}</p>
              <div class="flex justify-between">
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
  document.addEventListener('DOMContentLoaded', () => {
    (async () => {
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      if (!id) return;

      try {
        const res = await fetch('http://localhost:3000/api/produtos');
        const produtos = await res.json();
        const produto = produtos.find(p => p.id == id);
        if (!produto) {
          console.warn('Produto não encontrado');
          return;
        }

        // Preenche dados do produto na página
        document.querySelector('h1').textContent = produto.nome;
        document.querySelector('p.text-yellow-600').textContent = `R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}`;
        const imagemElem = document.querySelector('#produto-imagem');
        if (imagemElem) {
          imagemElem.src = `/imagens/${produto.imagem}`;
          imagemElem.alt = produto.nome;
        }

        // Evento de adicionar ao carrinho
        const btnAdicionar = document.getElementById('btnAdicionarCarrinho');
        if (btnAdicionar) {
          btnAdicionar.addEventListener('click', () => {
            const nome = document.getElementById('inputNome').value.trim();
            const numero = document.getElementById('inputNumero').value.trim();
            const tamanho = document.getElementById('inputTamanho').value;

            if (!tamanho) {
              alert('Por favor, selecione um tamanho.');
              return;
            }

            const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

            carrinho.push({
              id_produto: produto.id,
              quantidade: 1,
              nome_personalizado: nome || null,
              numero_personalizado: numero || null,
              tamanho,
              imagem: produto.imagem,
            });

            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            alert('Produto adicionado ao carrinho!');
          });
        }

      } catch (err) {
        console.error('Erro ao carregar produto:', err);
      }
    })();
  });
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

        const preco = Number(produto.preco) || 0;
        const subtotal = preco * item.quantidade;
        const tr = document.createElement('tr');
        tr.className = 'border-b';
        tr.innerHTML = `
          <td class="px-4 py-3">
            <img src="/imagens/${item.imagem}" alt="${produto.nome}" class="w-20 h-auto mx-auto">
          </td>
          <td class="px-4 py-3">${produto.nome}</td>
          <td class="px-4 py-3">${item.nome_personalizado} #${item.numero_personalizado}</td>
          <td class="px-4 py-3">R$ ${preco.toFixed(2).replace('.', ',')}</td>
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

const btnFinalizar = document.getElementById('finalizarPedido');
if (btnFinalizar) {
  btnFinalizar.addEventListener('click', async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (!usuario) {
      alert('Você precisa estar logado para finalizar o pedido.');
      window.location.href = 'login.html';
      return;
    }

    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: usuario.id,
          itens: carrinho
        }),
      });

      const data = await res.json(); // Leia a resposta apenas uma vez

      if (res.ok) {
      try {
        // Busca dados atualizados dos produtos antes de salvar para exibir depois
        const itensCompletos = await Promise.all(carrinho.map(async item => {
          try {
            const resProduto = await fetch(`http://localhost:3000/api/produtos/${item.id_produto}`);

            if (!resProduto.ok) throw new Error(`Produto ${item.id_produto} não encontrado`);

            const dados = await resProduto.json();

            return {
              nome: dados.nome,
              preco: dados.preco,
              quantidade: item.quantidade,
              tamanho: item.tamanho,
              nome_personalizado: item.nome_personalizado,
              numero_personalizado: item.numero_personalizado
            };
            
          } catch (err) {
            console.error(`Erro ao buscar produto ${item.id_produto}:`, err.message);
            // Preencher com dados mínimos para evitar quebra
            return {
              nome: 'Produto não encontrado',
              preco: 0,
              quantidade: item.quantidade,
              tamanho: item.tamanho,
              nome_personalizado: item.nome_personalizado,
              numero_personalizado: item.numero_personalizado
            };
          }
        }));

        localStorage.setItem('itensPedidoFinalizado', JSON.stringify(itensCompletos));
        localStorage.setItem('pedidoId', data.id_pedido);
        localStorage.removeItem('carrinho');

        window.location.href = 'finalizar-pedido.html';
      } catch (erroProdutos) {
        alert('Erro ao montar os dados do pedido: ' + erroProdutos.message);
      }
    } else {
      alert('Erro ao finalizar pedido: ' + (data.error || 'Erro desconhecido'));
    }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      const linkEntrar = document.getElementById('linkEntrar');
      const linkCriarConta = document.getElementById('linkCriarConta');
      const welcomeText = document.getElementById('welcomeText');
      const btnSair = document.getElementById('btnSair');

      if (usuario && usuario.nome) {
        if (linkEntrar) linkEntrar.style.display = 'none';
        if (linkCriarConta) linkCriarConta.style.display = 'none';
        if (welcomeText) welcomeText.textContent = `Bem-vindo(a), ${usuario.nome}!`;
        if (btnSair) btnSair.style.display = 'inline-block';
      } else {
        if (linkEntrar) linkEntrar.style.display = 'inline';
        if (linkCriarConta) linkCriarConta.style.display = 'inline';
        if (welcomeText) welcomeText.textContent = 'Bem‑vindo à Alternativa Store!';
        if (btnSair) btnSair.style.display = 'none';
      }

      if (btnSair) {
        btnSair.addEventListener('click', () => {
          localStorage.removeItem('usuario');
          window.location.reload();
        });
      }
    });