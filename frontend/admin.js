document.addEventListener('DOMContentLoaded', () => {
  // --- Código para o admin ---

  const formAddProduct = document.getElementById('addProductForm');
  const tabelaProdutos = document.getElementById('produtosTableBody');

  // Função para carregar e listar produtos na tabela do admin
  async function carregarProdutos() {
    try {
      const res = await fetch('http://localhost:3000/api/produtos');
      if (!res.ok) throw new Error('Erro ao carregar produtos');
      const produtos = await res.json();

      tabelaProdutos.innerHTML = ''; // limpa tabela

      produtos.forEach((produto, index) => {
        const precoNum = Number(produto.preco) || 0;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-3 py-2">${index + 1}</td>
            <td class="px-3 py-2">${produto.nome}</td>
            <td class="px-3 py-2">R$ ${precoNum.toFixed(2).replace('.', ',')}</td>
            <td class="px-3 py-2">
            <button class="text-red-600 hover:underline" data-id="${produto.id}" onclick="excluirProduto(${produto.id})">Excluir</button>
            </td>
        `;
        tabelaProdutos.appendChild(tr);
        });
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  }

  // Envio do formulário para adicionar produto
  if (formAddProduct) {
    formAddProduct.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = formAddProduct.nome.value.trim();
      const preco = parseFloat(formAddProduct.preco.value);
      const imagem = formAddProduct.imagem.value.trim();
      const imagemFinal = imagem;
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
          body: JSON.stringify({ nome, preco, imagem: imagemFinal , estoque, tamanho }),
        });

        const data = await res.json();

        if (res.ok) {
          alert('Produto adicionado com sucesso!');
          formAddProduct.reset();
          carregarProdutos(); // atualiza tabela
        } else {
          alert('Erro ao adicionar produto: ' + (data.error || 'Erro desconhecido'));
        }
      } catch (error) {
        alert('Erro de conexão: ' + error.message);
      }
    });
  }

  // Função para excluir produto (deixe global para ser chamada no onclick do botão)
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

  // Carregar produtos ao abrir página admin
  carregarProdutos();
});
