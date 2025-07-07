// server.js with support for full CRUD, soft delete, and restore functionality

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const FILE_PATH = path.join(__dirname, 'products.json');

app.use(express.json());
app.use(express.static('public'));

const USERS_FILE = path.join(__dirname, 'users.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Helper to load users
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const raw = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(raw);
}

// Helper to save users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Helper to load orders
function loadOrders() {
  if (!fs.existsSync(ORDERS_FILE)) return [];
  const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
  return JSON.parse(raw);
}

// Helper to save orders
function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// Login endpoint
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const users = loadUsers();
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Don't send password back to client
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Register endpoint
app.post('/register', (req, res) => {
  try {
    const { username, password, fullName, address } = req.body;
    const users = loadUsers();
    
    // Check if user already exists
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const newUser = { username, password, fullName, address };
    users.push(newUser);
    saveUsers(users);
    
    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Helper to load products
function loadProducts() {
  if (!fs.existsSync(FILE_PATH)) return [];
  const raw = fs.readFileSync(FILE_PATH, 'utf8');
  return JSON.parse(raw);
}

// Helper to save products
function saveProducts(products) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(products, null, 2));
}

// GET all products
app.get('/api/products', (req, res) => {
  try {
    const products = loadProducts();
    res.json(products);
  } catch {
    res.status(500).send("Error loading products");
  }
});

// POST new product
app.post('/api/products', (req, res) => {
  try {
    const products = loadProducts();
    const ids = products.map(p => p.id);
    const nextId = ids.length ? Math.max(...ids) + 1 : 1;
    const newProduct = { ...req.body, id: nextId };
    products.push(newProduct);
    saveProducts(products);
    res.json(newProduct);
  } catch {
    res.status(500).send("Failed to save product");
  }
});

// PUT update existing product
app.put('/api/products/:id', (req, res) => {
  try {
    const products = loadProducts();
    const index = products.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).send("Product not found");
    products[index] = { ...products[index], ...req.body };
    saveProducts(products);
    res.json(products[index]);
  } catch {
    res.status(500).send("Failed to update product");
  }
});

// DELETE soft delete a product
app.delete('/api/products/:id', (req, res) => {
  try {
    const products = loadProducts();
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).send("Not found");
    product.active = false;
    product.deletedAt = new Date().toISOString();
    saveProducts(products);
    res.json(product);
  } catch {
    res.status(500).send("Failed to delete product");
  }
});

// Restore soft-deleted product
app.post('/api/products/:id/restore', (req, res) => {
  try {
    const products = loadProducts();
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).send("Not found");
    product.active = true;
    delete product.deletedAt;
    saveProducts(products);
    res.json(product);
  } catch {
    res.status(500).send("Failed to restore product");
  }
});

// Submit new order
app.post('/api/orders', (req, res) => {
  try {
    const orders = loadOrders();
    const orderData = req.body;
    
    // Generate order ID
    const orderIds = orders.map(o => o.id);
    const nextOrderId = orderIds.length ? Math.max(...orderIds) + 1 : 1;
    
    const newOrder = {
      id: nextOrderId,
      ...orderData,
      orderDate: new Date().toISOString(),
      status: 'pending'
    };
    
    orders.push(newOrder);
    saveOrders(orders);
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save order' });
  }
});

// Get all orders (for admin)
app.get('/api/orders', (req, res) => {
  try {
    const orders = loadOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load orders' });
  }
});

// Update order status
app.put('/api/orders/:id', (req, res) => {
  try {
    const orders = loadOrders();
    const orderIndex = orders.findIndex(o => o.id == req.params.id);
    if (orderIndex === -1) return res.status(404).json({ message: 'Order not found' });
    
    orders[orderIndex] = { ...orders[orderIndex], ...req.body };
    saveOrders(orders);
    res.json(orders[orderIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
