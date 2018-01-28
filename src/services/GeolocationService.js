const User = require('../models/User')

module.exports = {
  isNearOrigin(data) {
    const userid = data.iduser

    User.find({
      origin: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [data.longitude, data.latitude]
          },
          $maxDistance: 5,
          $minDistance: 1
        }
      },
      id: userid
    }).then((users) => {
      console.log(users)
    })
  }
}