const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const jwt = require('./utils/jwt')
const app = express()


app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))


let i = 0
app.all('/*', (request, res, next) => {
  i++
  console.log(i)
  const url = request.originalUrl
  console.log(url)
  if (url === '/api/login') {
    next()
    return
  }
  const token = request.headers.authorization
  jwt
    .verify(token)
    .then((value) => {
      if (value === true) {
        console.log('token is true')
        next()
        return
      }
    })
    .catch((err) => {
      res.send({
        data: err,
        meta: { status: 401, msg: 'invalidToken' },
      })
      return
    })
})



require('./routes/authRoutes')(app)
require('./routes/menuRoutes')(app)
require('./routes/settingsRoutes')(app)
require('./routes/statisticsRouts')(app)
require('./routes/waterRights')(app)
require('./routes/chargeRoutes')(app)
require('./routes/chartRoutes')(app)
require('./routes/alarmRoutes')(app)

const PORT = process.env.PORT || 5000

app.listen(PORT)

require('./ws')