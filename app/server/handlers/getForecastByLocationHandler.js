const metOfficeApi = require('../apis/metOfficeApi')

module.exports = async function getForecastByLocationHandler (request, response) {
  const { locationId } = request.params
  const forecast = await metOfficeApi.getForecast({ locationId })

  response.json(forecast)
}
