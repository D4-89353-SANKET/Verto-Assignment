const pool = require('../config/db');

async function increaseStock(id, amount) {
    if (!Number.isInteger(amount) || amount <= 0) {
        const err = new Error('Amount must be a positive integer');
        err.statusCode = 400;
        throw err;
    }

    const [result] = await pool.query(
        `UPDATE products 
     SET stock_quantity = stock_quantity + ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
        [amount, id]
    );

    if (result.affectedRows === 0) {
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }

    const [[product]] = await pool.query(`SELECT * FROM products WHERE id = ?`, [id]);
    return product;
}

async function decreaseStock(id, amount) {
    if (!Number.isInteger(amount) || amount <= 0) {
        const err = new Error('Amount must be a positive integer');
        err.statusCode = 400;
        throw err;
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [[product]] = await conn.query(`SELECT * FROM products WHERE id = ? FOR UPDATE`, [id]);
        if (!product) {
            throw Object.assign(new Error('Product not found'), { statusCode: 404 });
        }

        if (product.stock_quantity < amount) {
            throw Object.assign(new Error('Insufficient stock'), { statusCode: 400 });
        }

        await conn.query(
            `UPDATE products 
       SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
            [amount, id]
        );

        await conn.commit();

        const [[updated]] = await pool.query(`SELECT * FROM products WHERE id = ?`, [id]);
        return updated;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

module.exports = { increaseStock, decreaseStock };
