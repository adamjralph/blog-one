const HandleError = require('../utils/HandleError')
const Joi = require('joi')

module.exports.validateArticle = (req, res, next) => {
  const schema = Joi.object({
    author: Joi.string().required(),
    title: Joi.string().required(),
    image: Joi.string(),
    summary: Joi.string(),
    text: Joi.string(),
    category: Joi.string(),
  }).required()

  const { error } = schema.validate(req.body)
  // console.dir(result)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new HandleError(msg, 400)
  } else {
    next()
  }
}
