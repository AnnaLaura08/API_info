const pool = require('../db');

exports.findAll = async () => {
    const text = 'SELECT idProd, nomeProd, preco, catprod, modelo, fabricante, estoque, locall FROM produtosInfo ORDER BY idProd';
    const result = await pool.query(text);
    return result.rows;
};

exports.create = async (nomeProd, preco, catprod, modelo, fabricante, estoque, locall) => {
    const text = 'INSERT INTO produtosInfo (nomeProd, preco, catprod, modelo, fabricante, estoque, locall) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [nomeProd, preco, catprod, modelo, fabricante, estoque, locall];
    const result = await pool.query(text, values);
    return result.rows[0];
};

exports.update = async (nomeProd, preco, catprod, modelo, fabricante, estoque, locall, idProd) => {
    const text = 'UPDATE produtosInfo SET nomeProd = $1, preco = $2, catprod = $3, modelo = $4, fabricante = $5, estoque = $6, locall = $7 WHERE idProd = $8 RETURNING *';
    const values = [nomeProd, preco, catprod, modelo, fabricante, estoque, locall, idProd];
    const result = await pool.query(text, values);
    return result.rows[0];
};

exports.delete = async (idProd) => {
    const text = 'DELETE FROM produtosInfo WHERE idProd = $1 RETURNING *';
    const values = [idProd];
    const result = await pool.query(text, values);
    return result.rows[0];
};