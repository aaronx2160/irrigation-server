const conn = require('../config/db2')

module.exports = (app) => {
  app.get('/api/alarmdevicedefault', (req, res) => {
    const sql = 'select *, count(*) over() as total from alarmdevicefault GROUP BY Id order by ?? desc limit ? offset ?'
    const placeHolder = ['AlarmTime', 10, 0]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({ data: null, meta: { status: 404, msg: err } })
      } else {
        res.send({ data: ress, meta: { status: 200, msg: err } })
      }
    })
  })
  app.post('/api/alarmdevicedefault', (req, res) => {
    let pageNum, offset
    pageNum = req.body.pageNum
    offset = (pageNum - 1) * 10
    const sql = 'select *, count(*) over() as total from alarmdevicefault GROUP BY Id order by ?? desc limit ? offset ?'
    const placeHolder = ['AlarmTime', 10, offset]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({ data: null, meta: { status: 404, msg: err } })
      } else {
        res.send({ data: ress, meta: { status: 200, msg: err } })
      }
    })
  })
}