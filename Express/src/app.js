const express = require('express');
const app = express();
const porta = 3000;

app.get('/', (requisicao, resposta) => resposta.send('Hello world'));

app.listen(porta, () => {
  console.log(`App ouvindo na porta ${porta}`);
});
