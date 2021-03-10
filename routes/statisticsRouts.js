const conn = require("../config/db2")
module.exports = (app) => {
  app.post("/api/useWaterInfo", (req, res) => {
    const DeviceCode = req.body.DeviceCode.trim()
    const CardCode = req.body.CardCode.trim()
    const data = {}
    if (DeviceCode !== "" || CardCode !== "") {
      conn(
        "SELECT COUNT(*) AS total FROM rptusewaterdetail where ??=? or ?? =?",
        ["DeviceCode", DeviceCode, "CardCode", CardCode],
        (e, ress) => {
          if (e) {
            return res.send({
              data: null,
              meta: { status: 404, msg: e },
            })
          }
          data.total = ress[0].total
          conn(
            "select * from rptusewaterdetail where ??=? or ??=? order by StopPumpTime DESC limit 10",
            ["DeviceCode", DeviceCode, "CardCode", CardCode],
            (err, result) => {
              if (err)
                return res.send({
                  data: null,
                  meta: { status: 404, msg: err },
                })
              data.userWaterDetailList = result
              res.send({
                data: data,
                meta: { status: 200, msg: err },
              })
            }
          )
        }
      )
    } else {
      conn("SELECT COUNT(*) AS total FROM rptusewaterdetail", (e, ress) => {
        if (e) {
          return res.send({
            data: null,
            meta: { status: 404, msg: e },
          })
        }
        data.total = ress[0].total
        conn(
          "select * from rptusewaterdetail order by StopPumpTime DESC limit 10",
          (err, result) => {
            if (err)
              return res.send({
                data: null,
                meta: { status: 404, msg: err },
              })
            data.userWaterDetailList = result
            res.send({
              data: data,
              meta: { status: 200, msg: err },
            })
          }
        )
      })
    }
  })
  app.get("/api/wellUseWater/:deviceCode", (req, res) => {
    const { deviceCode } = req.params
    const sql = "select * from rptusewaterdetail where ?? = ? Order by ?? DESC"
    const placeHolder = ["DeviceCode", deviceCode, "StopPumpTime"]
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
  app.post("/api/useWaterInfoPerPage", (req, res) => {
    const DeviceCode = req.body.DeviceCode.trim()
    const CardCode = req.body.CardCode.trim()
    const { pageNum } = req.body
    const offSet = (pageNum - 1) * 10
    if (DeviceCode !== "" || CardCode !== "") {
      conn(
        "Select * from (SELECT * FROM rptusewaterdetail where ??=? or ?? =? Order by StopPumpTime ) as a limit 10 offset ?",
        ["DeviceCode", DeviceCode, "CardCode", CardCode, offSet],
        (err, result) => {
          if (err)
            return res.send({
              data: null,
              meta: { status: 404, msg: err },
            })
          res.send({
            data: result,
            meta: { status: 200, msg: err },
          })
        }
      )
    } else {
      conn(
        "select * from rptusewaterdetail order by ?? DESC limit ? offset ?",
        ["StopPumpTime", 10, offSet],

        (e, result) => {
          if (e)
            return res.send({
              data: null,
              meta: { status: 404, msg: e },
            })
          res.send({
            data: result,
            meta: { status: 200, msg: e },
          })
        }
      )
    }
  })
  app.post("/api/search", (req, res) => {
    const { DeviceCode, CardCode } = req.body
    conn(
      "select * from rptusewaterdetail where ?? = ? or ?? = ?",
      ["DeviceCode", DeviceCode, "CardCode", CardCode],
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

  app.post("/api/waterCard", (req, res) => {
    const deviceId = req.body
    const sql = "select * from basecardinfo where ?? in (?)"
    const placeHolder = ["DeviceId", deviceId]
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

  app.get("/api/deviceExpandInfo/:deviceId", (req, res) => {
    const { deviceId } = req.params
    const sql =
      "select * from basedeviceexpandinfo as expandInfo inner join basedeviceinfo as deviceinfo on expandInfo.DeviceId = deviceinfo.Id where ?? = ?"
    const placeHolder = ["DeviceId", deviceId]
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

  app.post("/api/rptcardoperatedetail", (req, res) => {
    const { deviceId } = req.body
    const sql =
      "select * from rptcardoperatedetail where ?? in (?) and ??=? order by ??"
    const placeHolder = ["DeviceCode", deviceId, "OperateType", 3, "CreateTime"]
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
}
