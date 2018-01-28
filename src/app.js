const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config/config')
const mongoose = require('mongoose')
const path = require('path')
const socketEvents = require('./socket_events/events')
const fs = require('fs')
const https = require('https')

const sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase: 'columbia'
}

const app = express()
let server = https.createServer(sslOptions, app)
const io = require('socket.io')(server)

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

// ROUTES
// app.use('/', index)
app.get('*', (req, res) => {
  res.sendfile('./public/index.html')
})
// SOCKET EVENTS
socketEvents(io)

mongoose.connect('mongodb://localhost/argame', (err, res) => {
  if (err) {
    console.log('Error: connecting to database' + err)
  }
  server.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`)
  })
})
