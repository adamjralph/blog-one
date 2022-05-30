const express = require('express')
const { append } = require('express/lib/response')

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router()

// This will help us connect to the database
const dbo = require('../db/db')

recordRoutes.get('/posts', (req, res) => {
  // res.send('Hello World')
  const db = dbo.getDb()
  const collection = db.collection('post')
  collection.find({}).toArray(function (err, post) {
    console.log(post)
    res.render('posts', { post })
  })
})

// recordRoutes.use(express.json())
// recordRoutes.set('view engine', 'ejs')
// recordRoutes.set('views', path.join(__dirname, '../../views'))

// This section will help you get a list of all the records.
// recordRoutes.route('/posts').get(async function (_req, res) {
//   const dbConnect = dbo.getDb()

//   const posts = await dbConnect.collection('post').find({}).toArray()
//   console.log(posts[0].title)
//   const post = posts[0]
//   // res.json(posts)
//   res.render('posts', posts)
//   // res.send(posts[0].title)
//   // dbConnect
//   //   .collection('post')
//   //   .find({})
//   //   .limit(50)
//   //   .toArray(function (err, result) {
//   //     const { post } = result
//   //     console.log(result)
//   //     console.log({ post })
//   //     if (err) {
//   //       res.status(400).send('Error fetching listings!')
//   //     } else {
//   //       // res.send('hello world')
//   //       res.render('posts', { post })
//   //     }
//   //   })
// })

// This section will help you create a new record.
recordRoutes.route('/listings/recordSwipe').post(function (req, res) {
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
recordRoutes.route('/listings/updateLike').post(function (req, res) {
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
recordRoutes.route('/listings/delete/:id').delete((req, res) => {
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

module.exports = recordRoutes
