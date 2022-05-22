const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')

app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('static'))
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/about', (req, res) => {
  res.render('about')
})
app.listen(3001, () => {
  console.log('Listening on port 3001')
})
