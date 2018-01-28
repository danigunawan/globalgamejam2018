const User = require('../models/User')
const healthSrv = require('../services/HealthStatusService')
const photoFaceSrv = require('../services/PhotoFaceService')
const geoSrv = require('../services/GeolocationService')
const Photo = require('../models/Photo')
const fs = require('fs')

let DICT = {}

module.exports = (socket) => {

  socket.on('start-game', (id) => {
    console.log('start-game')
    console.log(id)
    DICT[id]['iduser'] = id
    console.log(DICT[id])
    socket.emit('started', DICT[id])
  })

  socket.on('init-data', (state) => {
    let user = new User({
      nickname: state.username,
      picture: state.userPhoto,
      origin: {
        type: 'Point',
        coordinates: [state.origin.longitude, state.origin.latitude]
      },
      location: {
        type: 'Point',
        coordinates: [state.origin.longitude, state.origin.latitude]
      }
    })
    user.save((err, userSaved) => {
      if (err) {
        socket.emit('error', err)
        return
      }
      DICT[userSaved._id] = state
      console.log(userSaved._id)
      console.log(DICT)
      socket.emit('user-saved', userSaved)
    })
  })

  socket.on('position', (data) => {
    console.log('on_position')
    console.log(data)
    // si esta cerca de el punto origen activa el boton
    if (geoSrv.isNearOrigin(data)) {
      socket.emit('can-recharge')
    } else {
      socket.emit('cant-recharge')
    }

    User
      .findById(data.userid)
      .then((user) => {
        user.location = {
          'type': 'Point',
          'coordinates': [data.longitude, data.latitude]
        }
        user.save((err) => {
          if (err) {
            socket.emit('error', err)
            return
          }
        })
      })
  })

  socket.on('invite', () => {
    socket.emit('invite_res', data)
  })

  socket.on('update-server', (state) => {
    console.log('update-server')
    console.log(state)
    User
      .findById(state.iduser)
      .then((user) => {
        user.savePhase1 = state.savePhase1
        user.savePhase2 = state.savePhase2
        user.vaccines = state.vaccines
        user.points = state.points
        user.save((err) => {
          if (err) {
            socket.emit('error', err)
            return
          }
        })
      })
  })

  socket.on('scanning', (state) => {
    console.log('-----------------start scanning')
    console.log(state)
    let data = {actualSickState: healthSrv.generateHealthStatus(), found: true}
    console.log(data)
    socket.emit('scanned', data)
    // let photo = state.lastPhoto
    // photoFaceSrv.writeToDisk(photo, (err, path) => {
    //   if (err) {
    //     console.log(err)
    //   }
    //   //comparar todas las fotos con la foto.tmp
    //   photoFaceSrv.compareToAllPhotos(path, (foundPhoto) => {
    //     // si hay un match, existe la foto y buscar contra bd a ver si esta enfermo o no
    //     if (foundPhoto) {
    //       // borro la foto
    //       fs.unlinkSync(path)
    //       // busco en la base de datos el estado
    //       Photo
    //         .find({path: path})
    //         .then((photo) => {
    //           console.log(photo)
    //           socket.emit('scanned', {actualSickState: photo.healthStatus, found: true})
    //         })
    //     } else {
    //       // no borro
    //       let hS = healthSrv.generateHealthStatus()
    //       let newPhoto = new Photo({
    //         path: path,
    //         healthStatus: hS
    //       })
    //
    //       // ponerle el usuario a la photo
    //       User
    //         .findById(state.iduser)
    //         .then((user) => {
    //           newPhoto.user = user
    //           newPhoto.save((err) => {
    //             if (err) {
    //               socket.emit('error', err)
    //               return
    //             }
    //             socket.emit('scanned', {actualSickState: hS, found: false})
    //           })
    //         })
    //     }
    //   })
    // })
  })
}