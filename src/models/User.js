const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  picture: {
    type: String
  },
  points: {
    type: Number
  },
  nickname: {
    type: String,
    unique: true
  },
  vaccines: {
    type: Number
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  savePhase1: {
    type: Number
  },
  savePhase2: {
    type: Number
  },
  location: {
    type: {
      type: String
    },
    coordinates: []
  },
  origin: {
    type: {
      type: String
    },
    coordinates: []
  },
  photos: [{type: Schema.Types.ObjectId, ref: 'Photo'}]
})

UserSchema.index({'location': '2dsphere'})
UserSchema.index({'origin': '2dsphere'})

UserSchema.methods.findNear = function (longitude, latitude, cb) {
  User.aggregate(
    [
      {
        '$geoNear': {
          'near': {
            'type': 'Point',
            'coordinates': [longitude, latitude]
          },
          'distanceField': 'distance',
          'spherical': true,
          'maxDistance': 10000
        }
      }
    ], function (err, results) {
      if (err) {
        cb(err, null)
      }
      cb(null, results)
    }
  )
}

module.exports = mongoose.model('User', UserSchema)