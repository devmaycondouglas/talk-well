## Requisitos

- Docker
- Docker Compose

## Executar o projeto
  - Renomear o arquivo `.env.example` para `.env`. O arquivo já tem alguns valores setados de sugestão, porem pode ser alterado.
  - Se preferir pode utilizar o seguinte comando para gerar uma cópia do .env.example para .env:
  ```
    cp .env.example .env
  ```
  - Abrir o terminal e na raiz do projeto, utilizar o comando:

  ```
    docker-compose up --build -d
  ```
  ou em algumas versões do docker, pode utilizar desta forma:
  ```
  docker compose up --build
  ```

## Acessando o projeto

- A API estará executando no seguinte endereço: [http://localhost](http://localhost)
- O frontend (Criado em React), estará executando no seguinte endereço: [http://localhost:8080](http://localhost:8080)

## Informações

Além da rota de `webhook/` e `conversations/:id/`, adicionei mais uma `conversations/`, onde irá devolver a lista de conversar criadas que no caso utilizei para listar as conversas a aplicação do frontend.

## Adicional

Caso queiram testar utilizando o [Insomnia](https://insomnia.rest/), deixei um arquivo na raíz do projeto (Insomnia_2025-12-06.yaml) que utilizei para realizar os testes e documentar um pouco :D

Ainda há alguns pontos de melhorias, porém o projeto está bem legal!