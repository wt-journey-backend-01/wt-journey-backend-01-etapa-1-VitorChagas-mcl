const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve a pasta public corretamente, com caminho absoluto
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

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
