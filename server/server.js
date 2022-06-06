require('dotenv').config()
const favicon = require('serve-favicon')

const methodOverride = require('method-override')

const express = require('express')
const cors = require('cors')
const path = require('path')
const HandleError = require('./HandleError')

// get MongoDB driver connection
const dbo = require('./db/db')

const PORT = process.env.PORT || 5000
const app = express()

app.use(methodOverride('_method'))
// app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(require('./routes/content'))
app.use(require('./routes/creators'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

app.use(express.static('static'))
app.use(favicon(path.join(__dirname + '../../static', 'favicon.ico')))

// Global error handling
app.use((err, req, res, next) => {
  const { status = 500 } = err
  const { message = 'An error occured' } = err
  res.status(status).send(message)
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
    console.log(`http://localhost:${PORT}`)
  })
})
