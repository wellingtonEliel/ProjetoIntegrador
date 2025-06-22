document.addEventListener('DOMContentLoaded', () => {
  const formAddProduct = document.getElementById('addProductForm');
  const tabelaProdutos = document.getElementById('produtosTableBody');
  const tabelaPedidos = document.getElementById('pedidosTableBody');
  const btnSair = document.getElementById('btnSair');

  if (btnSair) {
        btnSair.addEventListener('click', () => {
          localStorage.removeItem('usuario');
          window.location.href = 'login.html';
        });
      }


  async function carregarProdutos() {
    try {
      const res = await fetch('http://localhost:3000/api/produtos');
      if (!res.ok) throw new Error('Erro ao carregar produtos');
      const produtos = await res.json();
      tabelaProdutos.innerHTML = '';

      produtos.forEach((produto, index) => {
        const precoNum = Number(produto.preco) || 0;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-3 py-2">${index + 1}</td>
          <td class="px-3 py-2">${produto.nome}</td>
          <td class="px-3 py-2">R$ ${precoNum.toFixed(2).replace('.', ',')}</td>
          <td class="px-3 py-2">
            <button class="text-red-600 hover:underline" onclick="excluirProduto(${produto.id})">Excluir</button>
          </td>
        `;
        tabelaProdutos.appendChild(tr);
      });
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  }

  if (formAddProduct) {
    formAddProduct.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = formAddProduct.nome.value.trim();
      const preco = parseFloat(formAddProduct.preco.value);
      const imagem = formAddProduct.imagem.value.trim();
      const estoque = parseInt(formAddProduct.estoque.value);
      const tamanho = formAddProduct.tamanho.value;

      if (!nome || isNaN(preco) || preco < 0 || isNaN(estoque) || estoque < 0 || !tamanho) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/produtos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, preco, imagem, estoque, tamanho }),
        });

        const data = await res.json();
        if (res.ok) {
          alert('Produto adicionado com sucesso!');
          formAddProduct.reset();
          carregarProdutos();
        } else {
          alert('Erro ao adicionar produto: ' + (data.error || 'Erro desconhecido'));
        }
      } catch (error) {
        alert('Erro de conexão: ' + error.message);
      }
    });
  }

  window.excluirProduto = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/produtos/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Produto excluído com sucesso!');
        carregarProdutos();
      } else {
        const data = await res.json();
        alert('Erro ao excluir produto: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      alert('Erro de conexão: ' + error.message);
    }
  };

  async function atualizarStatusPedido(id, novoStatus) {
    try {
      const res = await fetch(`http://localhost:3000/api/pedidos/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });

      if (!res.ok) throw new Error('Erro ao atualizar status');
      carregarPedidos();
    } catch (error) {
      alert('Erro ao atualizar pedido: ' + error.message);
    }
  }

  async function carregarPedidos() {
    if (!tabelaPedidos) return;
    try {
      const res = await fetch('http://localhost:3000/api/pedidos');
      if (!res.ok) throw new Error('Erro ao buscar pedidos');
      const pedidos = await res.json();

      tabelaPedidos.innerHTML = '';
      pedidos.forEach(pedido => {
        const itensDetalhes = pedido.itens.map(i => {
          const personal = i.nome_personalizado || '—';
          const numero = i.numero_personalizado || '—';
          const fileLink = i.arquivo
            ? `<a href="/uploads/${i.arquivo}" download class="text-blue-600 hover:underline">baixar</a>`
            : '—';
          return `${i.nome} (x${i.quantidade})<br/>
                  Nome: ${personal}<br/>
                  Número: ${numero}<br/>
                  Arquivo: ${fileLink}`;
        }).join('<hr class="my-1">');

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-3 py-2">#${pedido.id}</td>
          <td class="px-3 py-2">${pedido.nome_cliente}</td>
          <td class="px-3 py-2">
            R$ ${pedido.total.toFixed(2).replace('.', ',')}
            <div class="mt-1 text-xs text-gray-500">${itensDetalhes}</div>
          </td>
          <td class="px-3 py-2">
            ${pedido.status}<br/>
            <button class="text-green-600 text-xs hover:underline mr-2" onclick="atualizarStatusPedido(${pedido.id}, 'enviado')">Marcar como Enviado</button>
            <button class="text-red-600 text-xs hover:underline" onclick="atualizarStatusPedido(${pedido.id}, 'cancelado')">Cancelar Pedido</button>
          </td>
        `;
        tabelaPedidos.appendChild(tr);
      });
    } catch (error) {
      alert('Erro ao carregar pedidos: ' + error.message);
    }
  }

  window.atualizarStatusPedido = atualizarStatusPedido;

  carregarProdutos();
  carregarPedidos();
});