const sqlMap = {
  // 用户
  user: {
    add: 'insert into user(name,age) values(?,?)',
    login:'select * from sysuser where UserName = ?'
  }
}

module.exports = sqlMap;