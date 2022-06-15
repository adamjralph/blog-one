const Joi = require('joi').extend(require('@joi/date'))

module.exports.validArticle = Joi.object({
  author: Joi.string().required(),
  // created: Joi.date(),
  // created: Joi.string(),
  // published: Joi.boolean().required(),
  title: Joi.string().required(),
  // slug: Joi.string().required(),
  image: Joi.string(),
  summary: Joi.string(),
  text: Joi.string(),
  category: Joi.string(),
}).required()
