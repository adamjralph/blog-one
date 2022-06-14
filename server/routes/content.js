const express = require('express')

// const { append } = require('express/lib/response')
const mongo = require('mongodb')

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const content = express.Router()

// const articlesPartial = require('../../views/partials/articles.ejs')

const dbo = require('../db/db')
const { validArticle } = require('../../utils/validationSchema')
const HandleError = require('../../utils/HandleError')
const handleAsync = require('../../utils/handleAsync')

function getCollection() {
  const db = dbo.getDb()
  return db.collection('post')
}

const validateArticle = (req, res, next) => {
  const { error } = validArticle.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new HandleError(msg, 400)
  } else {
    next()
  }
}

// Home page
content.get('/', (req, res) => {
  const db = dbo.getDb()
  const collection = getCollection()
  collection.find({}).toArray(async function (err, post) {
    if (post) {
      await res.render('index', { post })
    }
    if (err) {
      console.error('Unable to retrieve content')
    }
  })
})

content.get('/about', (req, res) => {
  res.render('about')
})

// Articles page
content.get('/articles', (req, res) => {
  const db = dbo.getDb()
  const collection = db.collection('post')
  collection.find({}).toArray(async function (err, post) {
    if (post) {
      await res.render('articles', { post })
    }
    if (err) {
      console.error('Unable to retrieve post')
    }
  })
})

// New article
content.post(
  '/new',
  validateArticle,
  handleAsync(async (req, res, next) => {
    const dbConnect = dbo.getDb()

    const author = req.body.author.trim()
    const title = req.body.title.trim()
    const image = req.body.image.trim()
    const summary = req.body.summary.trim()
    const text = req.body.text.trim()

    const slug = title
      .replace(',', '')
      .replace('.', '')
      .replace(':', '')
      .replace('?', '')
      .replace('&', '')
      .replace('-', '')
      .split(' ')
      .join('-')
      .toLowerCase()

    const formData = {
      author: author,
      created: new Date(),
      published: false,
      title: title,
      slug: slug,
      image: image,
      category: req.body.category,
      summary: summary,
      text: text,
    }
    // console.dir(formData)

    // validateArticle(formData)

    await dbConnect.collection('post').insertOne(formData, (err, result) => {
      console.log(`Added new post with the following id: ${result.insertedId}`)
    })
    res.redirect('mod')
  })
)

// Read article
content.get('/read/:slug', async (req, res, next) => {
  const db = dbo.getDb()
  const collection = db.collection('post')
  const query = { slug: req.params.slug }
  const article = await collection.findOne(query)
  if (!article) {
    return next(new HandleError('Article Not Found', 404))
  }
  res.render('read', { article })
})

// Edit article
content.get(
  '/edit/:slug',
  handleAsync(async (req, res) => {
    const collection = getCollection()
    const query = { slug: req.params.slug }
    const article = await collection.findOne(query)
    res.render('edit', { article })
  })
)

content.post(
  '/edit/:slug',
  // validateArticle,
  handleAsync(async (req, res) => {
    const collection = getCollection()
    const query = { slug: req.params.slug }

    const author = req.body.author.trim()
    const title = req.body.title.trim()
    const image = req.body.image.trim()
    const summary = req.body.summary.trim()
    const text = req.body.text.trim()

    const slug = title
      .replace(',', '')
      .replace('.', '')
      .replace(':', '')
      .replace('?', '')
      .replace('&', '')
      .replace('-', '')
      .split(' ')
      .join('-')
      .toLowerCase()

    const formData = {
      $set: {
        author: author,
        updated: new Date(),
        published: false,
        title: title,
        image: image,
        slug: slug,
        category: req.body.category,
        summary: summary,
        text: text,
      },
    }
    const article = req.body
    await collection.updateOne(query, formData, function (err, _result) {
      console.log('1 document updated')
      res.render('read', { article })
    })
  })
)

// Delete article
content.delete(
  '/delete/:id',
  handleAsync(async (req, res, next) => {
    const id = req.params.id
    console.log('id: ' + id + ' type: ' + typeof id)
    const mongoId = new mongo.ObjectId(id)
    const query = { _id: mongoId }
    const deleted = await getCollection().deleteOne(query)
    console.dir(deleted)
    res.render('delete')
  })
)

content.delete(
  '/delete/:id',
  handleAsync(async (req, res, next) => {
    const id = req.params.id
    const mongoId = new mongo.ObjectId(id)
    const query = { _id: mongoId }
    const dbConnect = dbo.getDb()
    const collection = dbConnect.collection('post')
    const deleted = await collection.deleteOne(query)
    res.render('mod')
  })
)
// Content Moderation
content.get(
  '/mod',
  handleAsync(async (req, res, next) => {
    const db = dbo.getDb()
    const collection = db.collection('post')
    collection.find({}).toArray(function (err, article) {
      res.render('mod', { article })
    })
  })
)

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

// Reference material

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
