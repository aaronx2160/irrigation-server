const mysql = require('mysql')
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'irrigation',

  // host: 'isodev.picp.net',
  // user: 'root',
  // password: 'zyjz_123456',
  // database: 'driven_well',
  // port: '3306',
})

module.exports = function (sql, placeHolder, callback) {
  pool.getConnection(function (conn_err, conn) {
    if (conn_err) {
      callback(conn_err, null)
    } else {
      conn.query(sql, placeHolder, function (query_err, result) {
        conn.release()
        callback(query_err, result)
      })
    }
  }) 
}
