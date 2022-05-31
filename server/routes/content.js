const express = require('express')
const res = require('express/lib/response')
const { append } = require('express/lib/response')

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const content = express.Router()

// This will help us connect to the database
const dbo = require('../db/db')

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
// content.route('/read').get(async function (req, res) {
//   const db = dbo.getDb()
//   const collection = db.collection('post')
//   collection.find({}).toArray(async function (err, post) {
//     if (post) {
//       console.dir(post[0].title)
//       await res.render('read', { post })
//     }
//     if (err) {
//       console.log('An error occured...')
//     }
//   })
// })

content.route('/read').get(async function (req, res) {
  const db = dbo.getDb()
  const collection = db.collection('post')
  const query = { _id: '6292e02d2062124bbc5962bb' }
  const cursor = collection.find()

  if (!cursor) {
    console.log('No documents found')
  }

  const post = await cursor.toArray()
  console.log(post)
  await res.render('read', { post })
})

// const { post } = await collection.find({})
// console.log(post)
// res.render('read', post)
// // console.log(post)

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
