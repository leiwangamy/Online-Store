const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ✅ Route: Serve index.html manually at root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// ✅ Route: Serve registration page
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

// ✅ Route: Handle registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  let users = [];
  if (fs.existsSync('users.json')) {
    users = JSON.parse(fs.readFileSync('users.json'));
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.send('Username already taken.');
  }

  users.push({ username, password });
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  res.send('Registration successful! <a href="/">Go to Login</a>');
});

// ✅ Route: Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  let users = [];
  if (fs.existsSync('users.json')) {
    users = JSON.parse(fs.readFileSync('users.json'));
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.redirect('/cart.html'); // Redirect to cart or dashboard after login
  } else {
    res.send('Invalid credentials. <a href="/">Try again</a>');
  }
});

// ✅ Route: Serve products API
app.get('/api/products', (req, res) => {
  if (fs.existsSync('products.json')) {
    const products = JSON.parse(fs.readFileSync('products.json'));
    res.json(products);
  } else {
    res.status(404).json({ error: 'Products file not found' });
  }
});

// ✅ Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
