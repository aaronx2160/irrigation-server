const conn = require('../config/db2')

module.exports = (app) => {
  app.get('/api/areas', (req, res) => {
    try {
      const sql = 'select * from sysarea'
      conn(sql, [], (err, ress) => {
        if (err) {
          res.send({
            data: null,
            meta: {
              msg: '获取地域列表失败',
              status: 404,
              error,
            },
          })
        } else {
          res.send({
            data: ress,
            meta: {
              msg: '成功获取地域列表',
              status: 200,
            },
          })
        }
      })
    } catch (error) {
      res.send({
        data: null,
        meta: {
          msg: '获取地域列表失败',
          status: 404,
          error,
        },
      })
    }
  })
}
