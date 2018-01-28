const userEvents = require('./user_events')
module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.emit('news', {hello: 'world'})

    userEvents(socket)
  })

  io.on('disconnect', () => {
    io.emit('user_disconnected')
  })
}