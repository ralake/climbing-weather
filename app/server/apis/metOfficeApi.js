const axios = require('axios')

const WEATHER_TYPES = [
  'Clear night',
  'Sunny day',
  'Partly cloudy(night)',
  'Partly cloudy(day)',
  'Not used',
  'Mist',
  'Fog',
  'Cloudy',
  'Overcast',
  'Light rain shower(night)',
  'Light rain shower(day)',
  'Drizzle',
  'Light rain',
  'Heavy rain shower(night)',
  'Heavy rain shower(day)',
  'Heavy rain',
  'Sleet shower(night)',
  'Sleet shower(day)',
  'Sleet',
  'Hail shower(night)',
  'Hail shower(day)',
  'Hail',
  'Light snow shower(night)',
  'Light snow shower(day)',
  'Light snow',
  'Heavy snow shower(night)',
  'Heavy snow shower(day)',
  'Heavy snow',
  'Thunder shower(night)',
  'Thunder shower(day)',
  'Thunder'
]

module.exports = {
  async getForecastForLocation (locationId) {
    const apiKey = process.env.MET_OFFICE_API_KEY
    const hourly = 3
    const { data } = await axios.get(`http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/${locationId}?res=${hourly}hourly&key=${apiKey}`)

    if (!data) return

    const { Location: location } = data.SiteRep.DV
    return formatDailyForecasts(location, hourly)
  }
}

function formatDailyForecasts (location, hourly) {
  const { Period: days } = location

  return {
    id: location.i,
    name: location.name,
    country: location.country,
    continent: location.continent,
    dailyForecasts: days.map(day => formatDailyForecast(day, hourly))
  }
}

function formatDailyForecast (day, hourly) {
  const totalHours = 24
  const maxRanges = totalHours / hourly
  const rangeStartTimes = getStartTimes(totalHours, hourly)
  const timeRanges = day.Rep
  const ranges = timeRanges.length
  const date = new Date(day.value).toISOString()
  let rangeIndex = maxRanges - ranges

  return {
    date: date,
    timeRanges: day.Rep.map(range => {
      const rangeData = {
        precipitationProbability: Number(range.Pp),
        feelsLikeTemperature: Number(range.F),
        temperature: Number(range.T),
        overview: WEATHER_TYPES[Number(range.W)],
        startsAt: new Date(new Date(day.value).setHours(rangeStartTimes[rangeIndex])).toISOString()
      }

      rangeIndex++
      return rangeData
    })
  }
}

function getStartTimes (totalHours, hourly) {
  return new Array(totalHours / hourly)
    .fill()
    .map((_, idx) => { return (idx * hourly) + 1 })
}
