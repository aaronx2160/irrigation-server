const conn = require('./config/db2')
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 5001 })

wss.on('connection', client => {
  console.log('client connected');
  client.on('message', msg => {
    const payload = JSON.parse(msg)
    if (payload.socketType === 'waterUsageRankData') {
      conn(
        'SELECT * FROM basedeviceinfo t1 LEFT JOIN basedevicedynamicinfo t2 ON t1.Id = t2.DeviceId where ??=? order by ?? DESC',
        ['WaterAreaId', 1, 't2.CollectTime'],
        (err, result) => {
          if (err) {
            console.log(err);
            return
          } else {
            payload.data = result
            client.send(JSON.stringify(payload))
          }
        }
      )
    }

  })

})