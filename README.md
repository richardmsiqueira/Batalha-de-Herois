Claro, aqui está um README básico para o seu código:

---

# Batalha Pokémon API

Esta é uma API simples para simulação de batalhas Pokémon e gerenciamento de Pokémons em um banco de dados PostgreSQL. A API permite criar, visualizar, atualizar e excluir Pokémons, bem como simular batalhas entre eles e visualizar o histórico das batalhas realizadas.

## Requisitos

- Node.js
- PostgreSQL

## Instalação

1. Clone este repositório.
2. Instale as dependências executando `npm install`.
3. Certifique-se de ter um servidor PostgreSQL em execução.
4. Crie um banco de dados chamado `batalha_pokemon`.
5. Importe o esquema do banco de dados a partir do arquivo `schema.sql`.

## Configuração

1. Abra o arquivo `index.js`.
2. Verifique e atualize as configurações do banco de dados, se necessário.
3. Certifique-se de que o servidor esteja configurado para a porta desejada (padrão: 5000).

## Uso

1. Inicie o servidor executando `npm start`.
2. Use uma ferramenta como Postman ou cURL para fazer solicitações para a API.
3. Acesse `http://localhost:5000` para verificar se o servidor está rodando corretamente.

## Rotas Disponíveis

- `GET /pokemon`: Retorna todos os Pokémons cadastrados.
- `POST /pokemon`: Adiciona um novo Pokémon ao banco de dados.
- `PUT /pokemon/:id`: Atualiza as informações de um Pokémon existente.
- `DELETE /pokemon/:id`: Remove um Pokémon do banco de dados.
- `GET /pokemon/nome/:nome`: Busca Pokémons pelo nome.
- `GET /batalha/:id_pokemon_1/:id_pokemon_2`: Simula uma batalha entre dois Pokémons.
- `GET /batalha`: Retorna o histórico de todas as batalhas realizadas.
- `GET /batalha/nome/:nome`: Busca batalhas pelo nome de algum dos Pokémons envolvidos.
- `GET /batalha/detalhes`: Retorna detalhes das batalhas, incluindo os nomes dos Pokémons e o vencedor.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou relatar problemas.

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo `LICENSE` para obter mais detalhes.

---

Esse README oferece uma visão geral do projeto, incluindo como configurar e usar a API, além de listar as rotas disponíveis e informações sobre contribuições e licenciamento.
