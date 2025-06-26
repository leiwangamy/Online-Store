const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// ✅ Middleware must go before any routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve registration page
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

// Handle registration logic
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

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Load users from file
  let users = [];
  if (fs.existsSync('users.json')) {
    users = JSON.parse(fs.readFileSync('users.json'));
  }

  // Check if user exists and password matches
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.send('Login successful!');
  } else {
    res.send('Invalid credentials.');
  }
});


app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
