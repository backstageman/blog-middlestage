const { querySql, queryOne } = require('../db')

function login(username, password) {
  let sql = `select * from admin_user where username = '${username}' and  password ='${password}' `
  return querySql(sql)
}

function findUser(username) {
  let sql = `select * from admin_user where username = '${username}'`
  return queryOne(sql)
}

module.exports = {
  login,
  findUser
}