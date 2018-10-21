const createApp = require('./server/createApp')
const port = process.env.PORT || 3000

const app = createApp()

app.start(port)
