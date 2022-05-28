const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

app.get('/', (req, res) => {
  res.render('index');
});

// Articles display
app.get('/articles', (req, res) => {
  res.render('articles');
});

// Individual article
app.get('/read', (req, res) => {
  res.render('read');
});

app.get('/about', (req, res) => {
  res.render('about');
});

const port = 3001;
app.listen(`${port}`, () => {
  console.log(`Server running on port ${port} : http://localhost:${port}`);
});
