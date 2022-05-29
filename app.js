const { MongoClient } = require('mongodb')

require('dotenv').config({ path:__dirname + '/.env' })
const TOKEN = process.env.DB_KEY

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

// const db = require('./db.js')
// const chainlink = { db }

app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

async function main () {

  const uri = `mongodb+srv://dbadmin:${TOKEN}@cluster0.u8vh2.mongodb.net/?retryWrites=true&w=majority`

  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('Connection open...')

    // await createPost(client, {
    //   title: 'Bockchain Decrypted',
    //   summary: "This website is for exploring the tech behind blockchain and it's impact on the world at large",
    //   author: 'The Chain Link',
    //   published: false,
    //   content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam magnam esse harum magni, totam numquam quaerat nemo necessitatibus animi expedita!"
    // })

    await getOnePost (client)

  } catch (e) {
    console.log('Unable to connect...')
    console.error(e)
  } finally {
    await client.close()
  }
}
main().catch(console.error)

async function createPost(client, newPost) {
  const result = await client.db('chainlink').collection('post').insertOne(newPost)

  console.log(`New post created with the following id: ${result.insertedId}`)
}

async function getOnePost(client) {

  const cursor = client.db('chainlink').collection('post').findOne(
    { }
  )
  const result = await cursor
  
  return result
  console.log(result)
}


const post = getOnePost()
 
app.get('/posts', async (req, res) => {
  const { post } = main()
  await res.send(post.title)
})

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

