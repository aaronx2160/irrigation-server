const conn = require('../config/db3')

module.exports = (app) => {
  app.get('/api/menu/:rid', async (req, res) => {
    const { rid } = req.params
    const sql = 'select ?? from sysrole where ?? =?'
    const placeHolder = ['MenuId', 'RoleCode', rid]
    const ress = await conn(sql, placeHolder)
    const menuSql = 'select * from sysmenu where ?? in ( ? )'
    const menuPlaceholder = ['Id', ress.rows[0]['MenuId'].split(',')]
    const menuArr = await conn(menuSql, menuPlaceholder)
    res.send({
      data: menuArr.rows,
      meta: {
        msg: '获取菜单列表成功',
        status: 200,
      },
    })
  })
}
