const express = require('express');
const path = require('path');   
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    console.log(`Requisição recebida: ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/contato', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contato.html'));
});

const lanche =  [
  {
    "id": 1,
    "nome": "DevBurger Clássico",
    "ingredientes": "Pão brioche, Carne 150g, Queijo cheddar, Alface americana, Tomate fresco, Molho especial"
  },
  {
    "id": 2,
    "nome": "Burger de Bacon",
    "ingredientes": "Pão australiano, Carne 180g, Queijo prato, Bacon crocante, Cebola caramelizada, Molho barbecue"
  },
  {
    "id": 3,
    "nome": "Commit Veggie",
    "ingredientes": "Pão integral, Burger de grão de bico, Queijo vegano, Rúcula, Tomate seco, Maionese de ervas"
  }
];

app.get('/api/lanches', (req, res) => {
  fs.writeFileSync(path.join(__dirname, 'public', 'lanches.json'), JSON.stringify(lanche, null, 2));
  const html = lanche.map(item => `
    <li style="list-style: none">
      <h1 style="color: white">${item.nome}</h1>
      <p style="color: white"><strong>Ingredientes: ${item.ingredientes}</strong></p>
    </li>
  `).join('');

  res.send(`<ul>${html}</ul>`);
})

app.use(express.urlencoded({ extended: true }));

app.post("/contato", (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;

  if (!nome || !email || !assunto || !mensagem) {
    return res.status(400).sendFile(path.join(__dirname, "public", "400.html"));
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Contato Recebido - DevBurger</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="/css/style.css">
        <link href="https://fonts.googleapis.com/css2?family=Libertinus+Mono&display=swap" rel="stylesheet">
      </head>
      <body class="bg-black text-white d-flex align-items-center justify-content-center min-vh-100">
        <div class="page-box">
          <h1>Contato Recebido! Muito Obrigado S2</h1>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Assunto:</strong> ${assunto}</p>
          <p><strong>Mensagem:</strong> ${mensagem}</p>
          <a href="/" class="btn-devburger">Voltar ao início</a>
        </div>
      </body>
    </html>
  `);
});

app.get("/sugestao", (req, res) => {
  const { nome, ingredientes } = req.query;

  if (nome && ingredientes) {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Sugestão Recebida - DevBurger</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="/css/style.css">
        <link href="https://fonts.googleapis.com/css2?family=Libertinus+Mono&display=swap" rel="stylesheet">
      </head>
      <body class="bg-black text-white d-flex align-items-center justify-content-center min-vh-100">
        <div class="page-box">
          <h1>Sugestão Recebida! Muito Obrigado S2</h1>
          <p><strong>Lanche sugerido:</strong> ${nome}</p>
          <p><strong>Ingredientes:</strong> ${ingredientes}</p>
          <a href="/" class="btn-devburger">Voltar ao início</a>
        </div>
      </body>
    </html>
  `);
  } else {
    res.status(400).sendFile(path.join(__dirname, "public", "400.html"));
  }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
