require('dotenv').config()

const express = require('express')
const path = require('path')
// const cors = require('cors')
// get MongoDB driver connection
const dbo = require('./db/db')

const PORT = process.env.PORT || 5000
const app = express()

// app.use(cors())
app.use(express.json())
app.use(require('./routes/content'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

// Global error handling
app.use(function (err, _req, res) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.log('Unable to connect to database')
    console.error(err)
    process.exit()
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
  })
})
