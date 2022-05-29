require('dotenv').config()
const { MongoClient } = require('mongodb')
const uri = process.env.ATLAS_URI
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let dbConnection

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err)
      }

      dbConnection = db.db('sample_airbnb')
      console.log('Successfully connected to MongoDB.')

      return callback()
    })
  },

  getDb: function () {
    return dbConnection
  },
}
