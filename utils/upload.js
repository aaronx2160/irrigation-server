const multer = require('multer')
const path = require('path')
const randomStr = require('./randomStr')


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '../public/uploads/devicePics')
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      let nameArr = file.originalname.split('.')
      const length = nameArr.length
      let ext = nameArr[length - 1]
      var changedName = `${randomStr.generate()}.${ext}`
      cb(null, changedName)
    },
  }),
})

module.exports = upload