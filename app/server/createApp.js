const express = require('express')
const handlers = require('./handlers')

module.exports = function createApp () {
  const app = express()
  const { getForecastByLocationHandler } = handlers

  app.use(express.static('app/client'))

  app.get('/', (request, response) => response.render('index.html'))
  app.get('/api/forecast/:locationId', getForecastByLocationHandler)

  return {
    start: (port) => {
      return app.listen(port, () => console.log(`Server listening on port ${port}`))
    }
  }
}
