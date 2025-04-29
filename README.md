Arquivos do projeto RH Helper

Como executar:

1 - Pra conseguir rodar, precisar ter postgreSQL instalado. e precisa ja ter um banco de dados chamado 'rh_helper'
2 - Ao abrir o projeto no vs code, executar o comando 'npm install' pra instalar as dependencias.
3 - criar arquivo .env.local no nivel do arquivo app.js que conterá as informções do ambiente, copiar o texto a seguir e colar dentro desse arquivo e alterar na string do DATABASE_URL a senhapostgre para a senha que o seu postgre estiver configurado

DATABASE_URL='postgres://postgres:senhapostgre@localhost:5432/rh_helper'
ORIGEM_HTTP='http://localhost:3000'
PORT=5000

4 - rodar o comando 'npm start' no terminal pra iniciar o servidor

Após esse passo a passo vai ser possivel rodar a API localmente.
