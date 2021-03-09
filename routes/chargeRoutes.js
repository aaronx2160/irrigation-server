const conn = require('../config/db2')

module.exports = (app) => {
  app.get('/api/basewatercharge', (req, res) => {
    const sql =
      'select * from basewatercharge as charge inner join basedeviceinfo as device on charge.BaseDeviceId = device.Id'
    conn(sql, [], (err, ress) => {
      if (err) {
        res.send({
          data: null,
          meta: {
            msg: err,
            status: 404,
          },
        })
      } else {
        res.send({
          data: ress,
          meta: {
            msg: null,
            status: 200,
          },
        })
      }
    })
  })
}
