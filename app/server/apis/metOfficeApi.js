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
  async getForecast ({ locationId }) {
    const totalHours = 24
    const hourly = 3

    if (totalHours % hourly) {
      throw new Error('hourly value is not valid')
    }

    const apiKey = process.env.MET_OFFICE_API_KEY
    const { data } = await axios.get(`http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/${locationId}?res=${hourly}hourly&key=${apiKey}`)
    const { Location: location } = data.SiteRep.DV

    return formatDays(location, totalHours, hourly)
  }
}

function formatDays (location, totalHours, hourly) {
  const { Period: days } = location
  const maxRanges = totalHours / hourly
  const startTimes = getStartTimes(totalHours, hourly)
  return days.reduce(
    (memo, day) => {
      const ranges = day.Rep.length
      let timeStartAt = maxRanges - ranges

      memo.days.push({
        dateTs: new Date(day.value),
        timeRanges: day.Rep.map((range, index) => {
          const rangeData = {
            precipitationProbability: Number(range.Pp),
            feelsLikeTemperature: Number(range.F),
            temperature: Number(range.T),
            overview: WEATHER_TYPES[Number(range.W)],
            timeLabel: startTimes[timeStartAt]
          }

          timeStartAt++
          return rangeData
        })
      })

      return memo
    },
    {
      id: location.i,
      name: location.name,
      country: location.country,
      continent: location.continent,
      days: []
    }
  )
}

function getStartTimes (totalHours, hourly) {
  return new Array(totalHours / hourly)
    .fill()
    .map((_, idx) => {
      const startTime = (idx * hourly) + 1
      return `${startTime < 10 ? '0' : ''}${startTime}:00`
    })
}
