const jsonwebtoken = require('jsonwebtoken')
const secret = 'noOneShouldKnowAboutThis!%^'
const conn = require('../config/db2')

module.exports = {
  generate(value, expires = '1 day') {
    // value 为传入值， expires为过期时间，这两者都会在token字符串中题先
    try {
      return jsonwebtoken.sign(value, secret, { expiresIn: expires })
    } catch (e) {
      console.error('jwt sign error --->', e)
      return ''
    }
  },

  verify(token) {
    const verified = new Promise((resolve, reject) => {
      try {
        const tokenUsername = jsonwebtoken.verify(token, secret).username
        const sql = 'select ?? from sysuser where ??=?'
        const placeHolder = ['Token', 'UserName', tokenUsername]
        conn(sql, placeHolder, (err, ress) => {
          if (err) {
            reject(err)
          } else {
            const dbToken = ress[0].Token
            resolve(token === dbToken)
          }
        })
      } catch (error) {
        reject('jwt verify error --->', error)
      }
    })
    return verified
  },
}
