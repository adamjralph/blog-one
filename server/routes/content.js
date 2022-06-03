const express = require('express')
const { append } = require('express/lib/response')
const { ObjectId } = require('mongodb')
// const res = require('express/lib/response')
// const { append } = require('express/lib/response')

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const content = express.Router()

// This will help us connect to the database
const dbo = require('../db/db')

content.get('/', (req, res) => {
  res.render('index')
})

content.get('/articles', (req, res) => {
  res.render('articles')
})

content.get('/about', (req, res) => {
  res.render('about')
})

content.get('/posts', (req, res) => {
  // res.send('Hello World')
  const db = dbo.getDb()
  const collection = db.collection('post')
  collection.find({}).toArray(async function (err, post) {
    if (post) {
      await res.render('posts', { post })
    }
    if (err) {
      console.error('Unable to retrieve post')
    }
  })
})

// Read post

content.get('/read', async (req, res) => {
  const db = dbo.getDb()
  const collection = db.collection('post')
  const query = {
    title: 'Bockchain Decrypted',
  }
  const post = await collection.findOne(query)
  res.render('read', { post })
})

// New post
content.get('/new', (req, res) => {
  res.render('new')
})

content.post('/new', async (req, res) => {
  const dbConnect = dbo.getDb()
  const formData = {
    author: req.body.author,
    created: new Date(),
    published: false,
    slug: req.body.slug,
    title: req.body.title,
    category: req.body.category,
    summary: req.body.summary,
    text: req.body.text,
  }

  const query = req.params

  await dbConnect.collection('post').insertOne(formData, (err, result) => {
    if (err) {
      res.status(400).send('Error inserting data')
    } else {
      console.log(`Added new post with the following id: ${result.insertedId}`)
      res.status(204).send()
    }
  })
})

// This section will help you create a new record.
content.route('/listings/recordSwipe').post(function (req, res) {
  const dbConnect = dbo.getDb()
  const matchDocument = {
    listing_id: req.body.id,
    last_modified: new Date(),
    session_id: req.body.session_id,
    direction: req.body.direction,
  }

  dbConnect
    .collection('matches')
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send('Error inserting matches!')
      } else {
        console.log(`Added a new match with id ${result.insertedId}`)
        res.status(204).send()
      }
    })
})

// This section will help you update a record by id.
content.route('/listings/updateLike').post(function (req, res) {
  const dbConnect = dbo.getDb()
  const listingQuery = { _id: req.body.id }
  const updates = {
    $inc: {
      likes: 1,
    },
  }

  dbConnect
    .collection('listingsAndReviews')
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`)
      } else {
        console.log('1 document updated')
      }
    })
})

// This section will help you delete a record.
content.route('/listings/delete/:id').delete((req, res) => {
  const dbConnect = dbo.getDb()
  const listingQuery = { listing_id: req.body.id }

  dbConnect
    .collection('listingsAndReviews')
    .deleteOne(listingQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting listing with id ${listingQuery.listing_id}!`)
      } else {
        console.log('1 document deleted')
      }
    })
})

module.exports = content
