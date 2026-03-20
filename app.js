const express = require('express');
const app = express();
const infoRoutes = require('./routes/infoRoutes');

app.use(express.json());
app.use('/produtos', infoRoutes);

app.listen(3000, () =>
     console.log('Servidor rodando em http://localhost:3000/produtos'));
