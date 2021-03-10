const fs = require('fs')
const path = require('path')
const conn = require('../config/db2')

module.exports = (app) => {
  app.get('/api/map', (req, res) => {
    const filePath = '/../public/MapJson/china.json'
    fs.readFile(path.join(__dirname + filePath), function (err, data) {
      if (err) {
        res.send({ data: null, meta: { status: 404, msg: err } })
      } else {
        res.send({
          data: data.toString(),
          meta: { status: 200, msg: null },
        })
      }
    })
  })
  app.get('/api/map/shaanxi', (req, res) => {
    const filePath = '/../public/MapJson/citys/610300.json'
    fs.readFile(path.join(__dirname + filePath), function (err, data) {
      if (err) {
        res.send({ data: null, meta: { status: 404, msg: err } })
      } else {
        res.send({
          data: data,
          meta: { status: 200, msg: null },
        })
      }
    })
  })
  app.get('/api/devices', (req, res) => {
    const sql = 'select * from basedeviceinfo'
    conn(sql, [], (err, ress) => {
      if (err) {
        res.send({ data: null, meta: { status: 404, msg: err } })
      } else {
        res.send({
          data: ress,
          meta: { status: 200, msg: null },
        })
      }
    })
  })
  app.post('/api/waterUsage', (req, res) => {
    const { deviceCode, year } = req.body
    const sql =
      'select * from (rptusewaterdetail as rpt inner join basedeviceinfo as device on rpt.DeviceCode = device.DeviceCode) inner join sysarea2 as area on device.AreaId = area.id where ?? in (?) && ?? = ?'
    const placeHolder = ['rpt.DeviceCode', deviceCode, 'rpt.InYear', year]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({ data: null, meta: { status: 404, msg: err } })
      } else {
        res.send({
          data: ress,
          meta: { status: 200, msg: null },
        })
      }
    })
  })
}
