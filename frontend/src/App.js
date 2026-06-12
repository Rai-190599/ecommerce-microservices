import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newOrderItem, setNewOrderItem] = useState('');

  const fetchData = () => {
    fetch('http://localhost:3001/products').then(res => res.json()).then(setProducts).catch(console.error);
    fetch('http://localhost:3002/orders').then(res => res.json()).then(setOrders).catch(console.error);
    fetch('http://localhost:3003/payments').then(res => res.json()).then(setPayments).catch(console.error);
    fetch('http://localhost:3004/notifications').then(res => res.json()).then(setNotifications).catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  const handleProductSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newProductName, price: Number(newProductPrice) })
    }).then(() => { setNewProductName(''); setNewProductPrice(''); fetchData(); });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3002/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: newOrderItem, status: 'Processing' })
    }).then(() => { setNewOrderItem(''); fetchData(); });
  };

  // 🧮 Calculate Overall Cost of All Products
  const totalInventoryCost = products.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  // Currency formatter for Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  // 🎨 Custom CSS for Hover Effects & Layout injected directly
  const customCSS = `
    .dashboard-container { min-height: 100vh; background-color: #0f172a; color: #f8fafc; padding: 40px 20px; font-family: 'Inter', sans-serif; }
    .glass-card {
      background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px); border-radius: 16px; padding: 24px; 
      border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; flex-direction: column;
    }
    .glass-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6); }
    .list-container { max-height: 250px; overflow-y: auto; padding-right: 8px; margin-top: 10px; }
    .list-container::-webkit-scrollbar { width: 6px; }
    .list-container::-webkit-scrollbar-track { background: transparent; }
    .list-container::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
    .list-container::-webkit-scrollbar-thumb:hover { background: #64748b; }
    .list-item {
      background: #1e293b; padding: 14px; margin: 8px 0; border-radius: 8px;
      display: flex; justify-content: space-between; align-items: center; border: 1px solid transparent;
      transition: all 0.2s ease; cursor: default;
    }
    .list-item:hover { background: #334155; border-color: rgba(255, 255, 255, 0.1); transform: scale(1.02); }
    .input-field { width: 90%; padding: 12px; margin-bottom: 16px; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: white; outline: none; transition: border 0.3s; }
    .input-field:focus { border-color: #3b82f6; }
    .btn { width: 100%; padding: 12px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; transition: 0.3s; color: white; }
    .btn-blue { background: #3b82f6; } .btn-blue:hover { background: #2563eb; }
    .btn-purple { background: #8b5cf6; } .btn-purple:hover { background: #7c3aed; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; max-width: 1300px; margin: 0 auto; align-items: stretch; }
    .badge { padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; }
  `;

  return (
    <div className="dashboard-container">
      <style>{customCSS}</style>
      
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px', color: '#60a5fa' }}>
        ⚡ E-commerce Microservices Command Center
      </h1>
      
      {/* Forms Section */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '50px', flexWrap: 'wrap' }}>
        <form onSubmit={handleProductSubmit} className="glass-card" style={{ width: '350px' }}>
          <h3 style={{ marginTop: 0, color: '#34d399' }}>📦 Add Product</h3>
          <input className="input-field" placeholder="Product Name" value={newProductName} onChange={e => setNewProductName(e.target.value)} required />
          <input className="input-field" type="number" placeholder="Price (₹)" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} required />
          <button className="btn btn-blue" type="submit">Add Product</button>
        </form>

        <form onSubmit={handleOrderSubmit} className="glass-card" style={{ width: '350px' }}>
          <h3 style={{ marginTop: 0, color: '#8b5cf6' }}>🛒 Place Order</h3>
          <input className="input-field" placeholder="Item Name" value={newOrderItem} onChange={e => setNewOrderItem(e.target.value)} required />
          <button className="btn btn-purple" type="submit">Place Order</button>
        </form>
      </div>

      {/* Services Grid Section */}
      <div className="services-grid">
        
        {/* Inventory - With Scrollbar */}
        <div className="glass-card">
          <h3 style={{ color: '#34d399', margin: '0 0 10px 0' }}>📦 Inventory</h3>
          <div className="list-container">
            {products.map((p, i) => (
              <div key={i} className="list-item">
                <span>{p.name}</span> 
                <span style={{ color: '#cbd5e1', fontWeight: '500' }}>{formatCurrency(p.price)}</span>
              </div>
            ))}
            {products.length === 0 && <p style={{ color: '#64748b', textAlign: 'center' }}>No products found</p>}
          </div>
        </div>

        {/* Orders - With Scrollbar */}
        <div className="glass-card">
          <h3 style={{ color: '#60a5fa', margin: '0 0 10px 0' }}>🚚 Orders</h3>
          <div className="list-container">
            {orders.map((o, i) => (
              <div key={i} className="list-item">
                <span>{o.item}</span> 
                <span className="badge" style={{ background: 'rgba(96, 165, 250, 0.2)', color: '#60a5fa' }}>{o.status}</span>
              </div>
            ))}
            {orders.length === 0 && <p style={{ color: '#64748b', textAlign: 'center' }}>No orders placed</p>}
          </div>
        </div>

        {/* Finance - Now showing Total Inventory Value */}
        <div className="glass-card" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <h3 style={{ color: '#fbbf24', width: '100%', textAlign: 'left', margin: '0 0 20px 0', alignSelf: 'flex-start' }}>💳 Finance Overview</h3>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '10px' }}>Total Value of All Products</p>
          <h1 style={{ fontSize: '3rem', margin: 0, color: '#fcd34d', textShadow: '0 0 20px rgba(252, 211, 77, 0.3)' }}>
            {formatCurrency(totalInventoryCost)}
          </h1>
        </div>

        {/* Alerts */}
        <div className="glass-card">
          <h3 style={{ color: '#f87171', margin: '0 0 10px 0' }}>🔔 Alerts</h3>
          <div className="list-container">
            {notifications.map((n, i) => (
              <div key={i} className="list-item" style={{ borderLeft: '4px solid #f87171' }}>
                {n.message}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;