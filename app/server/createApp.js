const express = require('express')
const { buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')

const handlers = require('./handlers')
const rawSchema = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')

module.exports = function createApp () {
  const app = express()
  const schema = buildSchema(rawSchema)
  const { getForecastByLocationHandler } = handlers

  app.use(express.static('app/client'))

  app.get('/', (request, response) => response.render('index.html'))
  app.get('/api/forecast/:locationId', getForecastByLocationHandler)

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
  }))

  return {
    start: (port) => {
      return app.listen(port, () => console.log(`Server listening on port ${port}`))
    }
  }
}
