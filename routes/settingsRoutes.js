const conn = require('../config/db2')
const randomStr = require('../utils/randomStr')
const getYMDHMS = require('../utils/time')
const config = require('../config/config')
const timeNow = require('../utils/time')
const multer = require('multer')
const upload = require('../utils/upload')




module.exports = (app) => {
  app.get('/api/wellList', (req, res) => {
    const sql = 'select * from basedeviceinfo where ?? =? order by ??'
    const placeHolder = ['WaterAreaId', 1, 'DeviceCode']
    conn(sql, placeHolder, (err, ress) => {
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
            msg: '获取机井列表成功',
            status: 200,
          },
        })
      }
    })
  })
  app.get('/api/wellExtendedInfo', (req, res) => {
    const sql = 'select * from basedeviceexpandinfo limit 1'
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
            msg: '获取机井详细信息成功',
            status: 200,
          },
        })
      }
    })
  })
  app.get('/api/liveDataList', async (req, res) => {
    conn(
      'SELECT * FROM basedeviceinfo t1 LEFT JOIN basedevicedynamicinfo t2 ON t1.Id = t2.DeviceId where ??=? order by ?? DESC',
      ['WaterAreaId', 1, 't2.CollectTime'],
      (err, result) => {
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
            data: result,
            meta: {
              msg: '获取机井列表成功',
              status: 200,
            },
          })
        }
      }
    )
  })
  app.get('/api/waterAreas', async (req, res) => {
    conn('select * from syswaterarea2', (err, result) => {
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
          data: result,
          meta: {
            msg: '成功获取水管区域列表',
            status: 200,
          },
        })
      }
    })
  })
  app.post('/api/waterArea', (req, res) => {
    const { province, city, district, waterAdmin, areaCode, remark } = req.body
    const time = timeNow(Date.now())
    conn(
      'insert into syswaterarea2 (??,??,??,??,??,??,??) values(?,?,?,?,?,?,?);',
      [
        'areaCode',
        'province',
        'city',
        'district',
        'admin',
        'createdAt',
        'note',
        areaCode,
        province,
        city,
        district,
        waterAdmin,
        time,
        remark,
      ],
      (err, result) => {
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
            data: result,
            meta: {
              msg: '成功添加水管区域列表',
              status: 200,
            },
          })
        }
      }
    )
  })
  app.put('/api/editWaterArea', (req, res) => {
    const { id, province, city, district, admin, areaCode, note } = req.body
    const time = timeNow(Date.now())
    const sql =
      'UPDATE syswaterarea2  SET ??=?,??=?,??=?,??=?,??=?,??=?, ??=? WHERE ?? = ?;'
    const placeHolder = [
      'province',
      province,
      'city',
      city,
      'district',
      district,
      'admin',
      admin,
      'areaCode',
      areaCode,
      'note',
      note,
      'updatedAt',
      time,
      'id',
      id,
    ]
    conn(sql, placeHolder, (err, ress) => {
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
            msg: '成功修改水管区域',
            status: 200,
          },
        })
      }
    })
  })
  app.delete('/api/waterArea/:id', (req, res) => {
    const { id } = req.params
    conn('DELETE FROM syswaterarea2 WHERE ??=?', ['id', id], (err, result) => {
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
          data: result,
          meta: {
            msg: '成功删除水管区域',
            status: 200,
          },
        })
      }
    })
  })
  app.get('/api/areas', (req, res) => {
    try {
      const sql = 'select * from sysarea2'
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
  app.post('/api/addArea', (req, res) => {
    const {
      province,
      city,
      district,
      town,
      village,
      areaCode,
      remark,
    } = req.body
    const createdAt = timeNow(Date.now())
    const sql =
      'insert into sysarea2 (??,??,??,??,??,??,??,??) values(?,?,?,?,?,?,?,?);'
    const placeHolder = [
      'areaCode',
      'province',
      'city',
      'district',
      'town',
      'village',
      'createdAt',
      'note',
      areaCode,
      province,
      city,
      district,
      town,
      village,
      createdAt,
      remark,
    ]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          data: null,
          meta: {
            msg: '获取地域列表失败',
            status: 404,
            err,
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
  })
  app.put('/api/editArea', (req, res) => {
    const {
      id,
      province,
      city,
      district,
      town,
      village,
      areaCode,
      note,
    } = req.body
    const updatedAt = timeNow(Date.now())
    const sql =
      'UPDATE sysarea2  SET ??=?,??=?,??=?,??=?,??=?,??=?, ??=?, ??=?  WHERE ?? = ?;'
    const placeHolder = [
      'province',
      province,
      'city',
      city,
      'district',
      district,
      'town',
      town,
      'village',
      village,
      'areaCode',
      areaCode,
      'note',
      note,
      'updatedAt',
      updatedAt,
      'id',
      id,
    ]
    conn(sql, placeHolder, (err, ress) => {
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
            msg: '成功修改行政区域',
            status: 200,
          },
        })
      }
    })
  })
  app.get('/api/basicInfo/:type', (req, res) => {
    const { type } = req.params
    const sql = 'select * from ??'
    const placeHolder = [type]
    conn(sql, placeHolder, (err, ress) => {
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
  app.post('/api/basicInfo', (req, res) => {
    const { type, name, colName } = req.body
    const time = timeNow(Date.now())
    const sql = 'INSERT INTO ?? ( ??,?? ) VALUES (?, ?)'
    placeHolder = [type, colName, 'CreateTime', name, time]
    conn(sql, placeHolder, (err, ress) => {
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
  app.put('/api/basicInfo', (req, res) => {
    const { id, type, name, colName } = req.body
    const time = timeNow(Date.now())
    const sql = 'UPDATE ?? SET ??=?, ??=? WHERE ??=?'
    placeHolder = [type, colName, name, 'EditTime', time, 'Id', id]
    conn(sql, placeHolder, (err, ress) => {
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
  app.delete('/api/basicInfo/:type/:id', (req, res) => {
    const { id, type } = req.params
    const sql = 'delete from ??  WHERE ??=?'
    placeHolder = [type, 'Id', id]
    conn(sql, placeHolder, (err, ress) => {
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
  app.get('/api/handyman', (req, res) => {
    const sql = 'select * from ??'
    placeHolder = ['sysaccendantmodel']
    conn(sql, placeHolder, (err, ress) => {
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
  app.post('/api/handyman', (req, res) => {
    const { name, phone } = req.body
    const time = timeNow(Date.now())
    const sql = 'INSERT INTO ?? ( ??,??,?? ) VALUES (?, ?,?)'
    placeHolder = [
      'sysaccendantmodel',
      'Name',
      'Phone',
      'CreateTime',
      name,
      phone,
      time,
    ]
    conn(sql, placeHolder, (err, ress) => {
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
  app.put('/api/handyman', (req, res) => {
    const { Id, Name, Phone } = req.body
    const time = timeNow(Date.now())
    const sql = 'UPDATE ?? SET ??=?, ??=?,??=? WHERE ??=?'
    placeHolder = [
      'sysaccendantmodel',
      'Name',
      Name,
      'Phone',
      Phone,
      'EditTime',
      time,
      'Id',
      Id,
    ]
    conn(sql, placeHolder, (err, ress) => {
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
  app.delete('/api/handyman/:id', (req, res) => {
    const { id } = req.params
    const sql = 'delete from ??  WHERE ??=?'
    placeHolder = ['sysaccendantmodel', 'Id', id]
    conn(sql, placeHolder, (err, ress) => {
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
  app.get('/api/deviceModel', (req, res) => {
    const sql = 'select ?? from sysdevicemodel'
    conn(sql, ['DeviceModel'], (err, ress) => {
      if (err) {
        res.send({
          data: null,
          meta: {
            msg: err,
            status: 404,
          },
        })
      } else {
        const deviceModelArr = []
        ress.forEach((v) => {
          deviceModelArr.push(v.DeviceModel)
        })
        res.send({
          data: deviceModelArr,
          meta: {
            msg: '获取机井型号信息成功',
            status: 200,
          },
        })
      }
    })
  })

  app.get('/api/irrigationAreaType', (req, res) => {
    const sql = 'select ?? from sysirrigationareatype'
    conn(sql, ['IrrigationAreaType'], (err, ress) => {
      if (err) {
        res.send({
          data: null,
          meta: {
            msg: err,
            status: 404,
          },
        })
      } else {
        const arr = []
        ress.forEach((v) => {
          arr.push(v.IrrigationAreaType)
        })
        res.send({
          data: arr,
          meta: {
            msg: '获取所在灌区类型信息成功',
            status: 200,
          },
        })
      }
    })
  })

  app.post('/api/addWell', (req, res) => {
    const id = randomStr.generate(10)
    const deviceInsertObj = {}
    const deviceExInsertObj = {}
    const errArr = []
    //insert into deviceinfo table starts
    const deviceInfoSql =
      'select COLUMN_NAME,column_comment from INFORMATION_SCHEMA.Columns where table_name=? and table_schema=?'
    const placeHolder = ['basedeviceinfo', config.dataBaseName]
    conn(deviceInfoSql, placeHolder, (err, ress) => {
      if (err) return errArr.push(err)
      for (let i = 0; i < ress.length; i++) {
        deviceInsertObj[[ress[i].COLUMN_NAME]] = req.body[ress[i].COLUMN_NAME]
      }
      deviceInsertObj['Id'] = id
      deviceInsertObj['EditTime'] = getYMDHMS(Date.now())
      deviceInsertObj['InstallTime'] = getYMDHMS(Date.now())
      deviceInsertObj['CreateTime'] = getYMDHMS(Date.now())

      let keys = Object.keys(deviceInsertObj)
      delete deviceInsertObj['Id']
      for (let i = 0; i < keys.length; i++) {
        if (deviceInsertObj[keys[i]] === '') {
          delete deviceInsertObj[keys[i]]
        }
      }

      conn('insert into basedeviceinfo set ?? = ?', ['Id', id], (e, r) => {
        if (e) return errArr.push(e)
        keys = Object.keys(deviceInsertObj)
        for (let i = 0; i < keys.length; i++) {
          const pl = [keys[i], deviceInsertObj[keys[i]], 'Id', id]
          conn(
            'UPDATE basedeviceinfo SET ?? = ? WHERE ?? = ? ',
            pl,
            (ee, rr) => {
              if (ee) return errArr.push(ee)
            }
          )
        }
      })

      //insert into deviceinfo table ends

      //insert into deviceextendinfo table starts
      const extendedDeviceInfoSql =
        'select COLUMN_NAME,column_comment from INFORMATION_SCHEMA.Columns where table_name=? and table_schema=?'
      const placeHolderr = ['basedeviceexpandinfo', config.dataBaseName]
      conn(extendedDeviceInfoSql, placeHolderr, (errr, resss) => {
        if (errr) return errArr.push(errr)
        for (let i = 0; i < resss.length; i++) {
          deviceExInsertObj[[resss[i].COLUMN_NAME]] =
            req.body[resss[i].COLUMN_NAME]
        }
        let keysEx = Object.keys(deviceExInsertObj)
        for (let i = 0; i < keysEx.length; i++) {
          if (deviceExInsertObj[keysEx[i]] === '') {
            delete deviceInsertObj[keys[i]]
          }
        }
        delete deviceExInsertObj['DeviceId']
        deviceExInsertObj['MakeTime'] = getYMDHMS(Date.now())
        conn(
          'insert into basedeviceexpandinfo set ?? = ?',
          ['DeviceId', id],
          (e, r) => {
            if (e) return errArr.push(e)
            keysEx = Object.keys(deviceExInsertObj)
            for (let i = 0; i < keysEx.length; i++) {
              const pl = [
                keysEx[i],
                deviceExInsertObj[keysEx[i]],
                'DeviceId',
                id,
              ]
              conn(
                'UPDATE basedeviceexpandinfo SET ?? = ? WHERE ?? = ? ',
                pl,
                (ee, rr) => {
                  if (ee) return errArr.push(ee)
                  if (i === keysEx.length - 1) {
                    if (errArr.length > 0) {
                      res.send({
                        data: null,
                        meta: { msg: errArr.join(' '), status: 404 },
                      })
                    } else {
                      res.send({
                        data: null,
                        meta: { msg: '成功添加机井', status: 200 },
                      })
                    }
                  }
                }
              )
            }
          }
        )
      })
    })
  })
  app.post('/api/imgUpload', (req, res) => {
    let storeFile = upload.single('file')
    const { type } = req.headers
    storeFile(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.send({
          data: null,
          meta: {
            status: 404,
            msg: '上传失败'
          }
        })
      } else if (err) {
        res.send({
          data: null,
          meta: {
            status: 404,
            msg: err
          }
        })
        // An unknown error occurred when uploading.
      } else {
        filePath = req.file.filename

        res.send({
          data: { filePath, type },
          meta: {
            status: 200,
            msg: '上传成功'
          }
        })
      }

    })

  })
  app.delete('/api/deleteWell/:Id', (req, res) => {
    const { Id } = req.params
    const deviceSql = 'DELETE FROM basedeviceinfo WHERE ?? =? '
    const devicePlaceholder = ['Id', Id]
    conn(deviceSql, devicePlaceholder, (e, r) => {
      if (e) {
        return res.send({ data: null, meta: { msg: e, status: 404 } })
      } else {
        const deviceExSql = 'DELETE FROM basedeviceexpandinfo WHERE ?? =? '
        const deviceExPlaceholder = ['DeviceId', Id]
        conn(deviceExSql, deviceExPlaceholder, (er, re) => {
          if (er) {
            return res.send({ data: null, meta: { msg: er, status: 404 } })
          } else {
            return res.send({ data: re, meta: { msg: er, status: 200 } })
          }
        })
      }
    })
  })
}
