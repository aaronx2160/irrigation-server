const conn = require('../config/db2')
module.exports = (app) => {
  app.get('/api/useWaterInfo', (req, res) => {
    const data = {}
    const sqlTotal =
      'SELECT COUNT(0) item, SUM(??) totalUsage FROM rptusewaterdetail'
    const placeHolder = ['UseWater']
    conn(sqlTotal, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          data: null,
          meta: { status: 404, msg: err },
        })
      } else {
        data.item = ress[0].item
        data.totalUsage = ress[0].totalUsage
        const sqlData =
          'select * from rptusewaterdetail order by ?? DESC limit ?'
        const dataPlaceholder = ['StopPumpTime', 10]
        conn(sqlData, dataPlaceholder, (e, r) => {
          if (e) {
            res.send({
              data: null,
              meta: { status: 404, msg: e },
            })
          } else {
            data.userWaterDetailList = r
            res.send({
              data: data,
              meta: { status: 200, msg: e },
            })
          }
        })
      }
    })
  })
  app.post('/api/useWaterInfoSearch', (req, res) => {
    const { dataArr, searchType } = req.body
    const { pageNum } = req.body

    const offSet = pageNum > 1 ? (pageNum - 1) * 10 : 0
    if (dataArr.length === 0 && !searchType) {
      const sql =
        ' select  *, count(*) over() as item, sum(??) over() as totalUsage from rptusewaterdetail order by StopPumpTime DESC limit 10 offset ?'
      const placeHolder = ['UseWater', offSet]
      conn(sql, placeHolder, (err, ress) => {
        if (err) {
          res.send({
            data: null,
            meta: { status: 404, msg: err },
          })
        } else {
          res.send({
            data: ress,
            meta: { status: 200, msg: err },
          })
        }
      })
    } else if (dataArr.length === 0) {
      const sql =
        ' select  *, count(*) over() as item, sum(??) over() as totalUsage from rptusewaterdetail where ??=? order by StopPumpTime DESC limit 10 offset ?'
      const placeHolder = ['UseWater', searchType, req.body[searchType], offSet]
      conn(sql, placeHolder, (err, ress) => {
        if (err) {
          res.send({
            data: null,
            meta: { status: 404, msg: err },
          })
        } else {
          res.send({
            data: ress,
            meta: { status: 200, msg: err },
          })
        }
      })
    } else {
      if (!searchType) {
        const sqlWithDate =
          ' select  *, count(*) over() as item, sum(??) over() as totalUsage from rptusewaterdetail where ?? >= ? and  ?? <= ? order by ?? DESC limit 10 offSet ?'
        const placeHolderWithDate = [
          'UseWater',
          'StopPumpTime',
          dataArr[0],
          'StopPumpTime',
          dataArr[1],
          'StopPumpTime',
          offSet,
        ]
        conn(sqlWithDate, placeHolderWithDate, (err, ress) => {
          if (err) {
            res.send({
              data: null,
              meta: { status: 404, msg: e },
            })
          } else {
            res.send({
              data: ress,
              meta: { status: 200, msg: err },
            })
          }
        })
      } else {
        const sqlWithDateNtype =
          ' select  *, count(*) over() as item, sum(??) over() as totalUsage from rptusewaterdetail where ?? >= ? and  ?? <= ? and ??=? order by ?? DESC limit 10 offSet ?'
        const placeHolderWithDateNtype = [
          'UseWater',
          'StopPumpTime',
          dataArr[0],
          'StopPumpTime',
          dataArr[1],
          searchType,
          req.body[searchType],
          'StopPumpTime',
          offSet,
        ]
        conn(sqlWithDateNtype, placeHolderWithDateNtype, (err, ress) => {
          if (err) {
            res.send({
              data: null,
              meta: { status: 404, msg: err },
            })
          } else {
            res.send({
              data: ress,
              meta: { status: 200, msg: err },
            })
          }
        })
      }
    }
  })
  app.get('/api/wellUseWater/:deviceCode', (req, res) => {
    const { deviceCode } = req.params
    const sql = 'select * from rptusewaterdetail where ?? = ? Order by ?? DESC'
    const placeHolder = ['DeviceCode', deviceCode, 'StopPumpTime']
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          data: null,
          meta: { status: 404, msg: err },
        })
      } else {
        res.send({
          data: ress,
          meta: { status: 200, msg: err },
        })
      }
    })
  })
  app.post('/api/search', (req, res) => {
    const { DeviceCode, CardCode } = req.body
    conn(
      'select * from rptusewaterdetail where ?? = ? or ?? = ?',
      ['DeviceCode', DeviceCode, 'CardCode', CardCode],
      (err, ress) => {
        if (err)
          return res.send({
            data: null,
            meta: { status: 404, msg: err },
          })
        res.send({
          data: ress,
          meta: { status: 200, msg: err },
        })
      }
    )
  })

  app.post('/api/waterCard', (req, res) => {
    const deviceId = req.body
    const sql = 'select * from basecardinfo where ?? in (?) order by ??'
    const placeHolder = ['DeviceId', deviceId, 'CreateTime']
    conn(sql, placeHolder, (err, ress) => {
      if (err)
        return res.send({
          data: null,
          meta: { status: 404, msg: err },
        })
      res.send({
        data: ress,
        meta: { status: 200, msg: err },
      })
    })
  })

  app.delete('/api/waterCard/:Id', (req, res) => {

    const { Id } = req.params
    const sql = 'DELETE FROM basecardinfo WHERE ??=?'
    const placeHolder = ['Id', Id]
    conn(sql, placeHolder, (err, ress) => {
      if (err)
        return res.send({
          data: null,
          meta: { status: 404, msg: err },
        })
      res.send({
        data: ress,
        meta: { status: 200, msg: err },
      })
    })

  })

  app.get('/api/deviceExpandInfo/:deviceId', (req, res) => {
    const { deviceId } = req.params
    const sql =
      'select * from basedeviceexpandinfo as expandInfo inner join basedeviceinfo as deviceinfo on expandInfo.DeviceId = deviceinfo.Id where ?? = ?'
    const placeHolder = ['DeviceId', deviceId]
    conn(sql, placeHolder, (err, ress) => {
      if (err)
        return res.send({
          data: null,
          meta: { status: 404, msg: err },
        })
      res.send({
        data: ress,
        meta: { status: 200, msg: err },
      })
    })
  })

  app.post('/api/rptcardoperatedetail', (req, res) => {
    const { deviceId } = req.body
    const sql =
      'select * from rptcardoperatedetail where ?? in (?) and ??=? order by ??'
    const placeHolder = ['DeviceCode', deviceId, 'OperateType', 3, 'CreateTime']
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          data: null,
          meta: { status: 404, msg: err },
        })
      } else {
        res.send({
          data: ress,
          meta: { status: 200, msg: err },
        })
      }
    })
  })
  app.get('/api/rptusewaterdetail/:DeviceCode', (req, res) => {
    const year = new Date().getFullYear()
    const { DeviceCode } = req.params
    const sql = 'select * from rptusewaterdetail where ??=? and ??=?'
    const placeHolder = ['DeviceCode', DeviceCode, 'InYear', year]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          data: null,
          meta: { status: 404, msg: err },
        })
      } else {
        res.send({
          data: ress,
          meta: { status: 200, msg: err },
        })
      }
    })
  })

  app.post('/api/DownloadData', (req, res) => {
    const { dataRange, searchType } = req.body
    if (dataRange.length === 0) {
      const sqlWithoutDate = 'select * from rptusewaterdetail where ?? =?'
      const placeHolderWithoutDate = [searchType, req.body[searchType]]
      conn(sqlWithoutDate, placeHolderWithoutDate, (err, ress) => {
        if (err) {
          res.send({
            data: null,
            meta: { status: 404, msg: err },
          })
        } else if (ress.length === 0) {
          res.send({
            data: null,
            meta: { status: 404, msg: '未找到任何数据，请您核实搜索信息是否正确' },
          })
        }
        else {
          res.send({
            data: ress,
            meta: { status: 200, msg: err },
          })
        }
      })
    } else if (searchType === '') {
      const sqlDate = 'select * from rptusewaterdetail where ?? >=? and ?? <=?'
      const placeHolderDate = ['StopPumpTime', dataRange[0], 'StopPumpTime', dataRange[1]]
      conn(sqlDate, placeHolderDate, (err, ress) => {
        if (err) {
          res.send({
            data: null,
            meta: { status: 404, msg: err },
          })
        } else if (ress.length === 0) {
          res.send({
            data: null,
            meta: { status: 404, msg: '未找到任何数据，请您核实搜索信息是否正确' },
          })
        }
        else {
          res.send({
            data: ress,
            meta: { status: 200, msg: err },
          })
        }
      })
    } else {
      const sql = 'select * from rptusewaterdetail where ?? =? and ?? >=? and ?? <=?'
      const placeHolder = [searchType, req.body[searchType], 'StopPumpTime', dataRange[0], 'StopPumpTime', dataRange[1]]
      conn(sql, placeHolder, (err, ress) => {
        if (err) {
          res.send({
            data: null,
            meta: { status: 404, msg: err },
          })
        } else if (ress.length === 0) {
          res.send({
            data: null,
            meta: { status: 404, msg: '未找到任何数据，请您核实搜索信息是否正确' },
          })
        }
        else {
          res.send({
            data: ress,
            meta: { status: 200, msg: err },
          })
        }
      })
    }
  })

  app.get('/api/rptchargeddetail', (req, res) => {
    const sql = 'select * , count(*) over() as total from rptchargedetail order by ?? desc limit ?'
    const placeHolder = ['CreateTime', 10]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          data: null,
          meta: { status: 404, msg: err },
        })
      } else {
        res.send({
          data: ress,
          meta: { status: 200, msg: err },
        })
      }
    })
  })

  app.post('/api/rptchargeddetail', (req, res) => {
    const { pageNum } = req.body
    const offset = (pageNum - 1) * 10
    const sql = 'select * , count(*) over() as total from rptchargedetail order by ?? desc limit ? offset ?'
    const placeHolder = ['CreateTime', 10, offset]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          data: null,
          meta: { status: 404, msg: err },
        })
      } else {
        res.send({
          data: ress,
          meta: { status: 200, msg: err },
        })
      }
    })
  })
}
