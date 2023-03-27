# API de autenticação
Esta é minha primeira API feita utilizando Typescript, Express, Mongoose, JWT e MongoDB. 

* Status: Em Desenvolvimento 🚧

---------------
## 🌟 Instalando
1) Clone o repositório
  ```
  $ git clone https://github.com/diogofrr/api-auth.git
  ```
2) Instale as dependências
  ```
  $ npm install
  ```

## ⚙ Configuração
__Obs:__ Para teste, foi utilizado um banco de desenvolvimento na nuvem fornecido pelo [MongoDB](https://www.mongodb.com/pt-br/cloud-database), então serão passadas instruções para configuração de acesso ao mesmo.

1)  Crie um arquivo `.env`
2)  Configure as seguintes variáveis de acordo com as informações que compõe a URL fornecida para conexão. Exemplo:

    🔗URL: mongodb+srv://DBTESTE:DBSENHA@cluster123.abcdef.mongodb.net/DBNOME
  ```
  DB_USERNAME=DBTESTE
  DB_PASSWORD=DBSENHA
  DB_CLUSTER=cluster123.abcdef.mongodb.net
  DB_NAME=DBNOME
  ```

## 🛣 Rotas

* As primeiras rotas da API serão de autenticação e antecedidas pela rota `/auth`.
  * `/register` - Cadastra um usuário
  * `/login` - Autentica um usuário
  * `forgot_password` - Envia um email para trocar a senha
  * `reset_password` - Troca a senha
  
