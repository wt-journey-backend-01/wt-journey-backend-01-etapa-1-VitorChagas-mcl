const express = require('express')

const app = express();
const PORT = 3000;

app.use(express.static('views'));

app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
});