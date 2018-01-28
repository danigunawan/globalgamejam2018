const HEALTH = {
  0: 'H',
  1: 'P2',
  2: 'P1'
}

module.exports = {
  generateHealthStatus() {
    let random = Math.floor(Math.random() * 3)
    return HEALTH[random]
  }
}