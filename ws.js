const conn = require('./config/db2')
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 5001 })


wss.on('connection', client => {
  console.log('client connected');

  client.on('open', () => {
    console.log('连接已开启')
  })

  client.on('close', () => {
    console.log('连接已关闭')
  })

  client.on("error", () => {
    console.log('连接出错')
  })

  client.on('message', msg => {
    const payload = JSON.parse(msg)
    switch (payload.socketType) {
      case 'getLiveData':
        getLiveData(client, payload)
        break
      case 'monthlyUsage':
        monthlyUsage(client, payload)
        break
    }

  })

})

const getLiveData = (client, payload) => {
  conn(
    'SELECT * FROM basedeviceinfo t1 LEFT JOIN basedevicedynamicinfo t2 ON t1.Id = t2.DeviceId where ??=? order by ?? DESC',
    ['WaterAreaId', 1, 't2.CollectTime'],
    (err, result) => {
      if (err) {
        payload.data = err
        client.send(JSON.stringify(payload))
      } else {
        payload.data = result
        client.send(JSON.stringify(payload))
      }
    }
  )
}

const monthlyUsage = (client, payload) => {
  const { deviceCode, year } = payload.value
  const sql =
    'select * from (rptusewaterdetail as rpt inner join basedeviceinfo as device on rpt.DeviceCode = device.DeviceCode) inner join sysarea2 as area on device.AreaId = area.id where ?? in (?) && ?? = ?'
  const placeHolder = ['rpt.DeviceCode', deviceCode, 'rpt.InYear', year]
  conn(sql, placeHolder, (err, ress) => {
    if (err) {
      payload.data = err
      client.send(JSON.stringify(payload))
    } else {
      payload.data = ress
      client.send(JSON.stringify(payload))

    }
  })
}