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

app.get('/api/lanches', (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'public', 'data', 'lanches.json'), 'utf-8');
    const lanches = JSON.parse(data);

    let lanchesList = '<ul>';
    lanches.forEach(lanche => {
      lanchesList += `<li style="color: white"><h3>${lanche.nome}</h3><p>${lanche.ingredientes}</p></li>`;
    });
    lanchesList += '</ul>';

    res.send(lanchesList);
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).send('Erro ao carregar o cardápio');
  }
});

app.get('/api/lanches/:id', (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'public/data/lanches.json'), 'utf-8');
    const lanches = JSON.parse(data);

    const id = parseInt(req.params.id);
    const lanche = lanches.find(l => l.id === id);

    if (lanche) {
      res.json(lanche);
    } else {
      res.status(404).send('Lanche não encontrado');
    }
  } catch (err) {
    console.error('Erro ao buscar lanche:', err);
    res.status(500).send('Erro interno');
  }
});

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
