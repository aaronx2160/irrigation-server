const conn = require('../config/db2')

module.exports = (app) => {
  app.get('/api/AgriUsagePlan', (req, res) => {
    const sql =
      'SELECT * FROM (basedistwaterplan as dist INNER JOIN basedistwaterplandevice as planDvice ON dist.id=planDvice.BaseDistWaterId)INNER JOIN basedeviceinfo as device ON planDvice.BaseDeviceId=device.Id where dist.WaterAreaId =? order by device.DeviceCode'
    conn(sql, ['174b014cad674b558d86b50e85453ec6'], (err, ress) => {
      if (err) {
        res.send({ data: null, meta: { err: err, status: 404 } })
      } else {
        res.send({ data: ress, meta: { err: null, status: 200 } })
      }
    })
  })
}
