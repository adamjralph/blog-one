const { MongoClient } = require('mongodb')

// require('dotenv').config({ path: __dirname + '/.env' })
// const uri = process.env.DB_URI

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')

const client = require('./db.js')
const db = client.db

app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('static'))
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')))

app.get('/posts', async (req, res) => {
  try {
    const post = await db.collection('post').find().toArray()
    console.log(db)
    if (post.length) {
      res.json(post)
      console.log(post)
    } else {
      res.json('There are currently no posts in the collection')
    }
  } catch (err) {
    console.log(err)
    res.json('An error has occured')
  }
})

app.get('/', (req, res) => {
  res.render('index')
})

// Articles display
app.get('/articles', (req, res) => {
  res.render('articles')
})

// Individual article
app.get('/read', (req, res) => {
  res.render('read')
})

app.get('/about', (req, res) => {
  res.render('about')
})

// const port = 3001
// app.listen(`${port}`, () => {
//   console.log(`Server running on port ${port} : http://localhost:${port}`)
// })

module.exports = app
