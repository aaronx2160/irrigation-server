const jwt = require('../utils/jwt')
const md5 = require('md5-node')
const randomStr = require('../utils/randomStr')
const conn = require('../config/db2')
const time = require('../utils/time')

module.exports = (app) => {
  app.post('/api/login', (req, res) => {
    let { username, password } = req.body.payload
    const sql = 'select * from sysuser where ?? = ?'
    const placeHolder = ['UserName', username]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          meta: {
            msg: '获取用户登录信息失败',
            status: 401,
          },
        })
        return
      }
      if (ress.length <= 0) {
        res.send({
          meta: {
            msg: '用户名不存在',
            status: 401,
          },
        })
        return
      }
      if (ress[0].IsActive === 0) {
        res.send({
          meta: {
            msg: '该账户未激活，请联系管理员',
            status: 401,
          },
        })
        return
      }
      password = md5(password)
      if (
        username !== ress[0].UserName ||
        password !== ress[0].UserPassword
      ) {
        res.send({
          meta: {
            msg: '用户名或者密码错误！',
            status: 401,
          },
        })
        return
      }
      let token = jwt.generate({ username: ress[0].UserName })
      const sqll = 'UPDATE sysuser SET ??=? where ?? =?'
      const placeHolderr = ['Token', token, 'UserName', username]
      conn(sqll, placeHolderr, (errr, resss) => {
        if (errr) {
          res.send({
            msg: '登录失败',
            error: errr.toString(),
            status: 500,
          })
        } else {
          res.send({
            data: {
              id: ress[0].Id,
              rid: ress[0].RoleCode,
              username: ress[0].UserName,
              usercode: ress[0].UserCode,
              parentUserCode: ress[0].ParentUserCode,
              mobile: '123',
              email: '123@qq.com',
              token: token,
            },
            meta: {
              msg: '登录成功',
              status: 200,
            },
          })
        }
      })
    })

  })

  app.get('/api/roles', (req, res) => {
    const sql = 'select * from  sysrole order by ??'
    conn(sql, ['CreateTime'], (err, ress) => {
      if (err) {
        res.send({
          meta: {
            msg: err,
            status: 404,
          },
        })
      } else {
        res.send({
          data: ress,
          meta: {
            msg: '获取成功',
            status: 200,
          },
        })
      }
    })
  })

  app.post('/api/roles', (req, res) => {
    const { roleName, roleCode, roleDesc } = req.body
    let id = md5(randomStr.generate(15))
    if (roleName === '系统管理员' || roleCode === '1') {
      res.send({
        meta: { msg: '只允许有一个系统管理员（代码1）', status: 501 },
      })
      return
    }
    const sql =
      'INSERT INTO sysrole ( ??, ??,??,??,??,??) VALUES ( ?,?,?,?,?,?);'
    const placeHolder = [
      'Id',
      'RoleName',
      'RoleCode',
      'Remark',
      'ParentRoleCode',
      'CreateTime',
      id,
      roleName,
      roleCode,
      roleDesc,
      1,
      new Date(),
    ]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          meta: {
            msg: err,
            status: 404,
          },
        })
      } else {
        res.send({
          data: ress,
          meta: {
            msg: '获取成功',
            status: 201,
          },
        })
      }
    })
  })
  app.put('/api/roles/:id', (req, res) => {
    let { RoleName, Remark, RoleCode } = req.body
    RoleCode = parseInt(RoleCode)
    if (RoleCode === 1) {
      res.send({
        meta: { msg: '您无权修改系统管理员角色', status: 501 },
      })
      return
    }
    const { id } = req.params
    const sql = 'UPDATE sysrole SET ??=?, ??=?, ??=? where ??=?'
    const placeHolder = [
      'RoleName',
      RoleName,
      'Remark',
      Remark,
      'RoleCode',
      RoleCode,
      'Id',
      id,
    ]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          meta: {
            msg: JSON.stringify(err),
            status: 404,
          },
        })
      } else {
        res.send({
          data: ress,
          meta: {
            msg: '更新成功',
            status: 200,
          },
        })
      }
    })
  })
  app.delete('/api/roles/:id', (req, res) => {
    const { id } = req.params
    if (id === '907bdda6a98677e0fa8ec436f45ae8ac') {
      res.send({
        meta: { msg: '您无权修改系统管理员角色', status: 501 },
      })
      return
    }

    const sql = 'DELETE FROM sysrole WHERE ??=?'
    const placeHolder = ['Id', id]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          meta: {
            msg: err,
            status: 404,
          },
        })
      } else {
        res.send({
          data: null,
          meta: {
            msg: '删除成功',
            status: 200,
          },
        })
      }
    })
  })
  app.get('/api/defaultRights/:roleId', (req, res) => {
    const { roleId } = req.params

    conn(
      'select ?? from syspermission where ?? = ?',
      ['MenuId', 'RoleId', roleId],
      (err, rightsIdList) => {
        if (err) return console.log(err)
        const rightsIdArr = []
        for (let i = 0; i < rightsIdList.length; i++) {
          rightsIdArr.push(parseInt(rightsIdList[i].MenuId))
        }

        if (rightsIdArr.length === 0) {
          res.send({
            data: [],
            meta: {
              msg: '获取权限列表成功',
              status: 200,
            },
          })
        } else {
          conn(
            'select * from sysmenu where ?? in ( ? )',
            ['Id', rightsIdArr],
            (e, rightsList) => {
              if (e) {
                console.log(e)
              } else {
                res.send({
                  data: rightsList,
                  meta: {
                    msg: '获取权限列表成功',
                    status: 200,
                  },
                })
              }
            }
          )
        }
      }
    )
  })
  app.post('/api/editRights', (req, res) => {
    let { menuId, roleCode } = req.body
    roleCode = parseInt(roleCode)
    if (roleCode === 1) {
      res.send({
        meta: { msg: '您无权修改系统管理员角色', status: 501 },
      })
      return
    }
    conn(
      'UPDATE sysrole SET ?? = ? WHERE ?? = ?',
      ['MenuId', menuId, 'RoleCode', roleCode],
      (err) => {
        if (err) {
          res.send({
            data: null,
            meta: { status: 404, msg: err },
          })
        } else {
          conn(
            'UPDATE sysuser SET ?? = ? WHERE ?? = ?',
            ['token', null, 'Authority', roleCode],
            (e, ress) => {
              if (e) {
                res.send({
                  data: null,
                  meta: { status: 404, msg: e },
                })
              } else {
                res.send({
                  data: ress,
                  meta: { status: 200, msg: '成功更新角色权限' },
                })
              }
            }
          )
        }
      }
    )
  })
  app.put('/api/changePassword/:username', (req, res) => {
    let { oldPswd, newPswd, pswdConfirm } = req.body
    const { username } = req.params

    oldPswd = md5(oldPswd)

    if (newPswd !== pswdConfirm) {
      res.send({
        meta: {
          msg: '两次输入的新密码不一致',
          status: 401,
        },
      })
      return
    }
    const sql = 'select ?? from sysuser where ?? =?'
    const placeHolder = ['UserPassword', 'UserName', username]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          meta: {
            msg: err,
            status: 404,
          },
        })
      } else if (oldPswd !== ress[0].UserPassword) {
        res.send({
          meta: {
            msg: '您输入的旧密码不正确！',
            status: 401,
          },
        })
        return
      } else {
        newPswd = md5(newPswd)
        const sqll = 'UPDATE sysuser SET ??=? WHERE ??=?'
        const placeHolderr = ['UserPassword', newPswd, 'UserName', username]
        conn(sqll, placeHolderr, (errr, resss) => {
          if (errr) {
            res.send({
              meta: {
                msg: errr,
                status: 404,
              },
            })
          } else {
            res.send({
              data: null,
              meta: {
                msg: '密码修改成功',
                status: 200,
              },
            })
          }
        })
      }
    })
  })
  app.get('/api/users', (req, res) => {

    conn('select * from sysuser order by ??', ['UserCode'], (error, result) => {
      if (error) {
        res.send({
          data: null,
          meta: {
            msg: error,
            status: 404,
          },
        })
      } else {
        result.forEach((v) => {
          v.Token = null
          v.UserPassword = null
          v.UserPasswordming = null
        })
        res.send({
          data: result,
          meta: {
            msg: '获取用户列表成功',
            status: 200,
          },
        })
      }
    })
  })
  app.put('/api/userState/:id', (req, res) => {
    const Id = req.params.id
    let { userstate } = req.body
    userstate = userstate === true ? 1 : 0
    const sql = 'UPDATE sysuser SET ??=?, ??=? WHERE ??=?'
    const placeHolder = ['IsActive', userstate, 'Token', null, 'Id', Id]
    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({
          meta: {
            status: 404,
            msg: err,
          },
        })
      } else {
        res.send({
          meta: {
            status: 200,
            msg: ress,
          },
        })
      }
    })
  })
  app.post('/api/users', async (req, res) => {
    const Id = md5(randomStr.generate(10))
    let keysArr = Object.keys(req.body)
    keysArr.push('Id')
    const { Address, AreaId, AuditFlag, Authority, Email, FullName, IsActive, IsAppUser, Mobile, ParentUserCode, Remark, RoleCode, UserCode, UserName, UserPasswordming, WaterAreaId } = req.body
    const UserPassword = md5(UserPasswordming)
    const CreateTime = time(Date.now())
    const sql = 'INSERT INTO sysuser(Id,AreaId,WaterAreaId,UserCode,UserName,UserPassword,ParentUserCode,RoleCode,FullName,Mobile,Email,Address,CreateTime,UserPasswordming,Authority,IsActive,IsAppUser,AuditFlag,Remark) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    const placeHolder = [Id, AreaId, WaterAreaId, UserCode, UserName, UserPassword, ParentUserCode, RoleCode, FullName, Mobile, Email, Address, CreateTime, UserPasswordming, Authority, IsActive, IsAppUser, AuditFlag, Remark]

    conn(sql, placeHolder, (err, ress) => {
      if (err) {
        res.send({ data: null, meta: { status: 404, msg: err } })
      } else {
        res.send({ data: ress, meta: { status: 200, msg: err } })
      }
    })
  })
  app.put('/api/userEdit', (req, res) => {
    const userEditObj = req.body
    const EditTime = time(Date.now())
    const pswd = md5(userEditObj.UserPasswordming)
    userEditObj.EditTime = EditTime
    userEditObj.UserPassword = pswd
    const userEditKeysArr = Object.keys(userEditObj)
    const errArr = []
    for (let i = 0; i < userEditKeysArr.length; i++) {
      let sql = "UPDATE sysuser SET ??=? WHERE ??=?"
      placeHolder = [userEditKeysArr[i], userEditObj[userEditKeysArr[i]], "Id", userEditObj['Id']]
      conn(sql, placeHolder, (err, ress) => {
        if (err) {
          errArr.push(err)
          return
        }
      })
    }
    if (errArr.length > 0) {
      res.send({
        data: null,
        meta: { msg: '修改用户失败', status: 404 }
      })
    } else {
      res.send({
        data: null,
        meta: { msg: '修改用户成功', status: 200 }
      })
    }
  })
  app.delete('/api/user/:id', (req, res) => {
    const { id } = req.params
    if (id === '4f55ef95b22221a523744db7cc702c1e') {
      res.send({ data: null, meta: { status: 404, msg: '没有权限' } })
      return
    }
    console.log(req.params);
    conn('DELETE FROM sysuser WHERE ?? = ? ', ['Id', id], (err, result) => {

      console.log(err);
      console.log(result);
      if (err) {
        res.send({
          data: null,
          meta: {
            status: 404,
            msg: '删除用户失败',
          },
        })
      } else {
        res.send({
          data: result,
          meta: {
            status: 200,
            msg: '已成功删除该用户',
          },
        })
      }
    })
  })

  app.post('/api/test', (req, res) => {
    const sql =
      'select DeviceId from basedevicedynamicinfo where DeviceCode NOT IN (?)'
    const placeHolder = [req.body]
    conn(sql, placeHolder, (err, ress) => {
      for (let i = 0; i < ress.length; i++) {
        const sqlDel = 'DELETE FROM basedevicedynamicinfo where DeviceId = ?'
        const placeHolderDel = [ress[i]['DeviceId']]
        conn(sqlDel, placeHolderDel, (e, r) => {
          console.log(e)
          console.log(r)
        })
      }
    })
  })
}
