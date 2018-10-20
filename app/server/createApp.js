const express = require('express')

module.exports = function createApp () {
  const app = express()

  app.get('/', (request, response) => {
    response.json({ ok: true })
  })

  return {
    start: (port) => {
      return app.listen(port, () => console.log(`Server listeneing on port ${port}`))
    }
  }
}
