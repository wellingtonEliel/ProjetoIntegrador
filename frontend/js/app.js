document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = e.target.nome.value;     // ← Deve corresponder a name="nome" no HTML
      const email = e.target.email.value;
      const senha = e.target.password.value;

      try {
        const response = await fetch('http://localhost:3000/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message || 'Cadastro realizado com sucesso!');
          window.location.href = 'login.html';
        } else {
          alert(data.error || 'Erro ao cadastrar usuário.');
        }
      } catch (err) {
        console.error(err);
        alert('Erro ao conectar com o servidor.');
      }
    });
  }
});
