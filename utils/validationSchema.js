const Joi = require('joi')

module.exports.validArticle = Joi.object({
  author: Joi.string().required(),
  created: Joi.string(),
  published: Joi.boolean().required(),
  title: Joi.string().required(),
  slug: Joi.string().required(),
  image: Joi.string(),
  category: Joi.string(),
  summary: Joi.string(),
  text: Joi.string(),
}).required()
