# Projeto de exemplo que simula um servidor de uma escola

## Criação do servidor:
- iniciar servidor:
  ```
  npm init -y
  ```

- edição do package.json
  - edit ```"name": projeto-escola```
  - edit ```"main": projeto-escola.js```
  - add ```"dev": nodemon projeto-escola.js``` in "scripts": {}

## Execução do servidor:
- install express and cors
```
npm install -g express cors
```

- install nodemon
```
npm install -g -D nodemon
```

- execute server
```
nodemon projeto-escola.js
```
