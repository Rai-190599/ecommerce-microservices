const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const redis = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://mongodb:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('📦 Connected to MongoDB'))
    .catch(console.error);

const Product = mongoose.model('Product', new mongoose.Schema({ name: String, price: Number }));

// Valkey Connection
const valkeyClient = redis.createClient({ url: 'redis://valkey-cache:6379' });
valkeyClient.connect()
    .then(() => console.log('⚡ Connected to Valkey Cache'))
    .catch(console.error);

// GET Products with Valkey Cache
app.get('/products', async (req, res) => {
    try {
        // 1. Pehle Valkey cache me check karo
        const cachedProducts = await valkeyClient.get('products_list');
        if (cachedProducts) {
            console.log("Serving from Valkey Cache! 🚀");
            return res.json(JSON.parse(cachedProducts));
        }

        // 2. Agar cache miss hua, toh MongoDB se lo
        console.log("Serving from MongoDB 🐢");
        const products = await Product.find();
        
        // 3. Data ko Valkey me save kar do (60 seconds ke liye)
        await valkeyClient.set('products_list', JSON.stringify(products), { EX: 60 });
        
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST Product & Invalidate Cache
app.post('/products', async (req, res) => {
    const newProduct = new Product({ name: req.body.name, price: req.body.price });
    await newProduct.save();
    
    // Naya item add hua, toh purana cache delete kar do taaki fresh data aaye
    await valkeyClient.del('products_list');
    
    res.status(201).json({ message: "Product added to MongoDB & Cache Cleared!", product: newProduct });
});

app.listen(3001, () => console.log('Product Service on port 3001'));