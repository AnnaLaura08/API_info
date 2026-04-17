const express = require('express'); 
const app = express(); 
const produtoRoutes = require('./routes/infoRoutes');  

// Middleware para servir os arquivos estáticos do front-end 
app.use(express.static('public')); 
 
// Middleware para interpretar JSON no corpo das requisições 
app.use(express.json()); 
 
// Aplica as rotas de produtos com o prefixo '/produtos' 
app.use('/produtos', produtoRoutes);  
 
// Inicia o servidor na porta 3000 
app.listen(3000, () => { 
    console.log('Servidor rodando em http://localhost:3000'); 
});