const pool = require('../config/db');

module.exports = {
    getAll: async (req, res) => {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    },

    getOne: async (req, res) => {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
        res.json(rows[0]);
    },

    create: async (req, res) => {
        const { name, description, stock_quantity, low_stock_threshold } = req.body;
        const [result] = await pool.query(
            'INSERT INTO products (name, description, stock_quantity, low_stock_threshold) VALUES (?, ?, ?, ?)',
            [name, description, stock_quantity || 0, low_stock_threshold || 5]
        );
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    },

    update: async (req, res) => {
        const { name, description, stock_quantity, low_stock_threshold } = req.body;
        await pool.query(
            'UPDATE products SET name=?, description=?, stock_quantity=?, low_stock_threshold=? WHERE id=?',
            [name, description, stock_quantity, low_stock_threshold, req.params.id]
        );
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    },

    remove: async (req, res) => {
        await pool.query('DELETE FROM products WHERE id=?', [req.params.id]);
        res.json({ message: 'Deleted' });
    },

    increaseStock: async (req, res) => {
        const { quantity } = req.body;
        await pool.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id=?', [quantity, req.params.id]);
        const [rows] = await pool.query('SELECT * FROM products WHERE id=?', [req.params.id]);
        res.json(rows[0]);
    },

    decreaseStock: async (req, res) => {
        const { quantity } = req.body;
        const [rows] = await pool.query('SELECT * FROM products WHERE id=?', [req.params.id]);
        const product = rows[0];
        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (product.stock_quantity < quantity) return res.status(400).json({ error: 'Insufficient stock' });
        await pool.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id=?', [quantity, req.params.id]);
        const [updated] = await pool.query('SELECT * FROM products WHERE id=?', [req.params.id]);
        res.json(updated[0]);
    },

    lowStock: async (req, res) => {
        const [rows] = await pool.query('SELECT * FROM products WHERE stock_quantity < low_stock_threshold');
        res.json(rows);
    }
};
