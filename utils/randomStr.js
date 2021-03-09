const md5 = require('md5-node')

module.exports = {
  generate(len) {
    len = len || 32
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    let maxPos = chars.length
    let rdStr = ''
    for (let i = 0; i < len; i++) {
      rdStr += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return md5(rdStr + Date.now())
  },
}
