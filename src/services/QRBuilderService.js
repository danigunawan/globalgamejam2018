const qr = require('qr-image')

module.exports = {
  buildQRUrl(url) {
    let buffer = qr.image(url, {type: 'svg'}).read()
    return String(buffer)
  },
  buildRegisterPageQR() {
    buildQRUrl('http://localhost/laganga')
  }
}