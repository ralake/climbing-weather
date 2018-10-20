const express = require('express')

module.exports = function createApp () {
  const app = express()

  app.use(express.static('app/client'))

  app.get('/', (request, response) => {
    response.render('index.html')
  })

  return {
    start: (port) => {
      return app.listen(port, () => console.log(`Server listeneing on port ${port}`))
    }
  }
}
