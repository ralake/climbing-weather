const metOfficeApi = require('../apis/metOfficeApi')

const resolvers = {
  locations: (args) => {
    const { locationIds } = args
    return Promise.all(
      locationIds.map(locationId => metOfficeApi.getForecastForLocation(locationId))
    )
  }
}

module.exports = resolvers
