class HandleError extends Error {
  constructor(message, status, body) {
    super()
    this.status = status
    this.message = message
    this.body = 'An error has occured'
  }
}

module.exports = HandleError
