document.addEventListener('DOMContentLoaded', () => {
  const listaItens = document.getElementById('listaItens');
  const valorTotal = document.getElementById('valorTotal');
  const form = document.getElementById('formFinalizarPedido');
  const mensagem = document.getElementById('mensagem');

  const itens = JSON.parse(localStorage.getItem('itensPedidoFinalizado')) || [];

  listaItens.innerHTML = ''; // limpa itens antigos

  if (itens.length === 0) {
    listaItens.innerHTML = '<li class="text-gray-500">Carrinho vazio.</li>';
    valorTotal.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;

  itens.forEach(item => {
    const precoTotal = item.preco * item.quantidade;
    total += precoTotal;

    const li = document.createElement('li');
    li.innerHTML = `
      <div class="flex justify-between items-center border-b pb-1">
        <span>${item.nome} (x${item.quantidade})</span>
        <span>${precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
    `;
    listaItens.appendChild(li);
  });

  valorTotal.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Captura o evento submit do formulário
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // previne envio real e reload da página

    // Aqui você pode colocar a validação ou envio dos dados para backend se quiser.

    // Exibe mensagem para o usuário
    mensagem.textContent = 'Seu pedido foi finalizado com sucesso!';

    // Opcional: limpa o carrinho do localStorage
    localStorage.removeItem('itensPedidoFinalizado');
    localStorage.removeItem('carrinho');

    // Após 2 segundos redireciona para página de pedidos
    setTimeout(() => {
      window.location.href = 'pedido.html';
    }, 2000);
  });
});

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