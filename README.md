# Alternativa Store

Projeto completo de loja virtual com funcionalidades de cadastro, login, gerenciamento de produtos e pedidos. Desenvolvido com Node.js, Express, MySQL e frontend estático com HTML/CSS/JS, tudo rodando via Docker.

---

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 (Tailwind via CDN), JavaScript
- **Backend**: Node.js com Express
- **Banco de Dados**: MySQL 8
- **Ambiente**: Docker + Docker Compose

---

## Estrutura do Projeto

```plaintext
alternativa-store/
├── backend/
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   └── models/
├── frontend/
│   ├── index.html
│   ├── cadastro.html
│   ├── login.html
│   ├── produtos.html
│   └── js/
├── init.sql
├── docker-compose.yml
└── README.md
```

---

## Como rodar o projeto

### Pré-requisitos

- Docker instalado
- Docker Compose instalado

### Passo a passo

1. Clone o repositório:

```bash
git clone https://github.com/wellingtonEliel/ProjetoIntegrador
cd alternativa-store
```

2. Execute o Docker Compose:

```bash
docker-compose up --build
```

3. Acesse no navegador:

```
http://localhost:3000
```

---

## Funcionalidades disponíveis

- Cadastro de usuário
- Login
- Cadastro, listagem, edição e exclusão de produtos
- Criação e listagem de pedidos

---

## Endpoints da API

| Método | Rota                  | Descrição                  |
|--------|-----------------------|----------------------------|
| POST   | `/api/usuarios`       | Criar novo usuário         |
| POST   | `/api/login`          | Login do usuário           |
| GET    | `/api/produtos`       | Listar todos os produtos   |
| POST   | `/api/produtos`       | Criar novo produto         |
| PUT    | `/api/produtos/:id`   | Atualizar produto por ID   |
| DELETE | `/api/produtos/:id`   | Remover produto por ID     |
| GET    | `/api/pedidos`        | Listar pedidos             |
| POST   | `/api/pedidos`        | Criar novo pedido          |

---

## Acesso ao Banco de Dados

Essas são as credenciais padrão configuradas no Docker Compose:

- Host: `db`
- Porta: `3306`
- Banco: `alternativa_store`
- Usuário: `user`
- Senha: `password`
- Root: `rootpassword`

---

## Dicas

- Para resetar o ambiente:

```bash
docker-compose down -v
docker-compose up --build
```

- Para ver os logs do backend:

```bash
docker logs -f node_backend
```

---

## Melhorias Futuras

- [ ] Validação de formulários no frontend
- [ ] Interface administrativa
- [ ] Responsividade mobile
- [ ] Integração com sistema de pagamento

---

## Licença

Projeto com fins educacionais. Livre para modificar e usar.