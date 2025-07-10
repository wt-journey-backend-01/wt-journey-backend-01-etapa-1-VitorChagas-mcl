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

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
