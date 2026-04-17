// routes/produtoRoutes.js 
const express = require('express'); 
const router = express.Router(); 
const produtoController = require('../controllers/infoController'); 

// Lista todos os produtos
router.get('/', produtoController.getProdutos); 

// Busca produtos por nome ou id
router.get('/buscar', produtoController.searchProdutos); 
 
// Cria um novo produto
router.post('/', produtoController.createProduto); 
 
// Atualiza um produto pelo ID
router.put('/:id', produtoController.updateProduto); 
 
// Remove um produto pelo ID
router.delete('/:id', produtoController.deleteProduto); 
 
module.exports = router;