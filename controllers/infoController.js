const infoModel = require('../models/infoModel');

exports.getInfo = async (req, res) => {
    try {
        const info = await infoModel.findAll();
        res.json(info);
    } catch (err) {
        console.error('Error ao buscar info:', err);
        res.status(500).json({ error: 'Error interno ao buscar info' });
    }
};

exports.createInfo = async (req, res) => {
    const { nomeProd, preco, catprod, modelo, fabricante, estoque, locall } = req.body;
    if (!nomeProd || !preco || !catprod || !modelo || !fabricante || !estoque || !locall) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    try {
        const info = await infoModel.create(nomeProd, preco, catprod, modelo, fabricante, estoque, locall);
        res.status(201).json(info);
    } catch (err) {
        console.error('Error ao criar info:', err);
        res.status(500).json({ error: 'Error interno ao criar info' });
    }
};

exports.updateInfo = async (req, res) => {
    const { id } = req.params;
    const { nomeProd, preco, catprod, modelo, fabricante, estoque, locall } = req.body;

    if (!nomeProd || !preco || !catprod || !modelo || !fabricante || !estoque || !locall) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const info = await infoModel.update(nomeProd, preco, catprod, modelo, fabricante, estoque, locall, id);
        
        if (!info) {
            return res.status(404).json({ error: 'Info nao encontrada' });
        }
        res.json(info);
    } catch (err) {
        console.error('Error ao atualizar info:', err);
        res.status(500).json({ error: 'Error interno ao atualizar info' });
    }
};

exports.deleteInfo = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedInfo = await infoModel.delete(id);
        if (!deletedInfo) {
            return res.status(404).json({ error: 'Info nao encontrada' });
        }
        res.json({ message: 'Info deletada com sucesso' });
    } catch (err) {
        console.error('Error ao deletar info:', err);
        res.status(500).json({ error: 'Error interno ao deletar info' });
    }
};