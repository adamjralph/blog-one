require('dotenv').config()
const favicon = require('serve-favicon')

const express = require('express')
const path = require('path')
const HandleError = require('../utils/HandleError')
const methodOverride = require('method-override')

// get MongoDB driver connection
const dbo = require('./db/db')

const PORT = process.env.PORT || 5000
const app = express()

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(require('./routes/content'))
app.use(require('./routes/creators'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

app.use(express.static('static'))
app.use(favicon(path.join(__dirname + '../../static', 'favicon.ico')))

app.all('*', (req, res, next) => {
  next(new HandleError('Page not found', 404))
})

// Global error handling
app.use((err, req, res, next) => {
  const { status = 500 } = err
  const { message = 'An error occured' } = err
  if (!err.message) err.message = 'An error occured'
  res.status(status).render('error', { err })
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
