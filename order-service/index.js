const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'admin', 
    host: 'postgresdb', 
    database: 'ecommerce', 
    password: 'adminpassword', 
    port: 5432,
});

// 🔄 Auto-Retry Logic: Jab tak DB ready na ho, wait karega
const connectWithRetry = async () => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, item VARCHAR(100), status VARCHAR(50));`);
        console.log('🐘 PostgreSQL is Ready & Table Created!');
    } catch (err) {
        console.log('⏳ Postgres not ready yet, retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

app.get('/orders', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Database not ready" });
    }
});

app.post('/orders', async (req, res) => {
    try {
        const result = await pool.query(
            'INSERT INTO orders (item, status) VALUES ($1, $2) RETURNING *',
            [req.body.item, req.body.status]
        );
        res.status(201).json({ message: "Order added to PostgreSQL!", order: result.rows[0] });
    } catch (err) {
        console.error("POST Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3002, () => console.log('🚀 Order Service running on port 3002'));