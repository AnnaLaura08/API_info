const express = require('express');
const router = express.Router();
const infoController = require('../controllers/infoController');

router.get('/', infoController.getInfo);
router.post('/', infoController.createInfo);
router.put('/:id', infoController.updateInfo);
router.delete('/:id', infoController.deleteInfo);

module.exports = router;