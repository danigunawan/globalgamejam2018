const cryptoSrv = require('../services/CryptoService')
const facenetSrv = require('../services/FaceNetService')
const fs = require('fs')
const path = require('path')

const parent_path = path.join(__dirname, '..', '/photos/')
module.exports = {
  writeToDisk(photo, cb) {
    // hacer md5 de la foto
    let fileName = cryptoSrv.md5(photo) + '.pic'
    let path = parent_path + fileName
    let data = new Buffer(photo.toString(), 'base64').toString('utf-8')
    fs.writeFile(path, data, (err) => {
      if (err) {
        return cb(err, null)
      }
      cb(null, path)
    })
  },
  compareToAllPhotos(path, cb) {
    let filenames = fs.readdirSync(parent_path)
    filenames = filenames.map(item => parent_path + item)
    for (let file of filenames) {
      if (facenetSrv.comparePhotos(file, path)) {
        return cb(file)
      }
    }
    cb(null)
  }
}