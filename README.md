# Alternativa Store

Loja virtual de camisas esportivas personalizadas, com backend em Node.js e banco MySQL rodando via Docker.

---

## Tecnologias

- Node.js 18
- MySQL 8
- Docker e Docker Compose
- Frontend estático (HTML, CSS, JS)

---

## Estrutura

- `/backend/Dockerfile` - imagem do backend Node.js
- `/docker-compose.yml` - orquestra backend e banco MySQL
- `/init.sql` - script para criar banco e tabelas no MySQL
- `/frontend/` - arquivos estáticos do frontend

---

## Requisitos

- Docker
- Docker Compose

---

## Como executar

1. Clone o repositório:
```bash
git clone https://github.com/wellingtonEliel/ProjetoIntegrador

```

2. (Opcional) Ajuste as variáveis do banco no `docker-compose.yml` conforme necessário (`DB_USER`, `DB_PASSWORD`, etc).


3. Suba os containers e faça o build do backend:

- Abra o docker no seu windows e espere estar online
- inicie o terminal bash
```bash
docker-compose up --build
```

4. Acesse o backend na URL:
```
http://localhost:3000
```

## Funcionalidade

- Crie um usuario com o email: admin@admin.admin para acessar a pagina do admnistrador principal
- Adicione produtos de acordo com a lista de imagens disponíveis
- Nesta pagina você também pode verificar a situação dos pedidos existentes
- Crie um usuário comum para fazer os testes de compra, pedido, verificar catálogo, personalização de produtos e finalização de pedidos.
- Apos  a criação de um pedido você pode verificar a lista de pedidos que seu usuário já realizou e os respectivos status

---

## Parar a aplicação

```bash
docker-compose down
```

---

## Comandos úteis

- Ver containers ativos:
```bash
docker ps
```

- Entrar no container do backend:
```bash
docker exec -it node_backend sh
```

- Ver logs do backend:
```bash
docker logs node_backend
```

- Ver logs do banco MySQL:
```bash
docker logs mysql_db
```

---



## Detalhes técnicos

- O banco MySQL está disponível na porta 3306.
- Os dados do banco ficam persistidos no volume Docker `dbdata`.
- O backend Node.js roda na porta 3000, conectando-se ao banco via hostname `db`.
- Os volumes sincronizam seu código local para facilitar desenvolvimento em tempo real.

---