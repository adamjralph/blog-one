import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import express, { Application } from 'express';
const app: Application = express();

const path = require('path');
const favicon = require('serve-favicon');

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

// A `main` function so that you can use async/await
async function main() {
  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.user.findMany({
    include: { posts: true },
  });
  // use `console.dir` to print nested objects
  console.dir(allUsers, { depth: null });
}

app.get('/users', async (req, res) => {
  const allUsers = await prisma.user.findMany({
    include: { posts: true },
  });
  // use `console.dir` to print nested objects
  res.json(allUsers);
});

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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

app.listen(3001, () => {
  console.log('Listening on port 3001');
});
