const HandleError = require('../utils/HandleError')
const Joi = require('joi')

module.exports.validateArticle = (req, res, next) => {
  const schema = Joi.object({
    // article: Joi.object({
    author: Joi.string().required(),
    created: Joi.string().required(),
    published: Joi.boolean().required(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    image: Joi.string(),
    category: Joi.string(),
    summary: Joi.string(),
    text: Joi.string(),
  }).required()
  // }).required()

  const { error } = schema.validate()
  // console.dir(result)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new HandleError(msg, 400)
  } else {
    next()
  }
}
