const express = require('express')
const ejs = require('ejs')
const path = require('path')

app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(3001, () => {
  console.log('Listening on port 3001')
})
