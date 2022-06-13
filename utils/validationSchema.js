const Joi = require('joi')

module.exports.validateArticle = Joi.object({
  new: Joi.object({
    author: Joi.string().required(),
    title: Joi.string().required(),
    image: Joi.string(),
    summary: Joi.string(),
    text: Joi.string(),
  }).required(),
})
