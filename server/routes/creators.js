const express = require('express')

const creators = express.Router()
const HandleError = require('../../utils/HandleError')

const dbo = require('../db/db')

function getCollection() {
  const db = dbo.getDb()
  return db.collection('post')
}

creators.get('/admin', (req, res) => {
  throw new HandleError('Not authorized', 403)
})

creators.get('/users', (req, res) => {
  const collection = getCollection()
  const { users } = collection.find({})
  res.send(users)
})

// Require /?password=a
const verifyPassword = (req, res, next) => {
  const { password } = req.query
  if (password === 'a') {
    next()
  }
  throw new HandleError('Password required!', 401)
}

creators.get('/secret', verifyPassword, (req, res) => {
  res.send('Accessed password protected area')
})

creators.get('/error', (req, res) => {
  broken.nothing()
})

module.exports = creators
