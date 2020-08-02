const mysql = require('mysql')
const { debug, dbConfig } = require('../utils/constant')
const { isObject } = require('../utils')

function connect() {
  return mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
  })
}

function querySql(sql) {
  const conn = connect()
  debug && console.log(sql)
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, results) => {
        if (err) {
          debug && console.log('查询失败：' + JSON.stringify(err))
          reject(err)
        } else {
          debug && console.log('查询成功：' + JSON.stringify(results))
          resolve(results)
        }
      })
    } catch (err) {
      reject(err)
    } finally {
      // 断开连接
      conn.end()
    }
  })
}

function queryOne(sql) {
  const conn = connect()
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, results) => {
        if (results && results.length > 0) {
          resolve(results[0])
        } else {
          resolve(null)
        }
      })
    } catch (err) {
      reject(err)
    } finally {
      conn.end()
    }
  })
}

function insert(model, tabelName) {
  return new Promise((resolve, reject) => {
    if (!isObject(model)) {
      reject(new Error('插入数据库失败，插入数据非对象'))
    } else {
      const keys = []
      const values = []
      // 遍历对象的属性，拼接sql所需要的keys 和 values
      Object.keys(model).forEach(key => {
        if (model.hasOwnProperty(key)) {
          keys.push(`\`${key}\``)
          values.push(`'${model[key]}'`)
        }
      })
      if (keys.length > 0 && values.length > 0) {
        let sql = `INSERT INTO \`${tabelName}\` (`
        const keysString = keys.join(',')
        const valuesString = values.join(',')
        sql = `${sql}${keysString}) VALUES (${valuesString})`
        debug && console.log(sql);
        const conn = connect()
        try {
          conn.query(sql, (err, result) => {
            if (err) {
              reject(err)
            } else {
              // console.log('result',result);
              // 上传通过的结果
              resolve(result)
            }
          })
        } catch (e) {
          reject(e)
        } finally {
          conn.end()
        }
      } else {
        reject(new Error('插入数据库失败，对象中没有任何属性'))
      }
    }
  })
}

function andLike(where, k, v) {
  if (where === 'where') {
    return `${where} \`${k}\` like '%${v}%' `
  } else {
    return `${where} and \`${k}\` like '%${v}%' `
  }
}

function and(where, k, v) {
  if (where === 'where') {
    return `${where} \`${k}\` = '${v}' `
  } else {
    return `${where} and \`${k}\` = '${v}' `
  }
}

function betweenAnd(where, fieldName, startTime, endTime) {
  if (where === 'where') {
    return `${where} \`${fieldName}\` between '${startTime}' and  '${endTime}'  `
  } else {
    return `${where} and \`${fieldName}\` between '${startTime}' and  '${endTime}'  `
  }
}

function update(model, tabelName, whereCondition) {
  return new Promise((resolve, reject) => {
    if (!isObject(model)) {
      reject(new Error('插入数据库失败，插入数据非对象'))
    } else {
      const entry = []
      delete model.id
      Object.keys(model).forEach(key => {
        if (model.hasOwnProperty(key)) {
          entry.push(`\`${key}\`='${model[key]}'`)
        }
      })
      if (entry.length > 0) {
        let sql = `UPDATE \`${tabelName}\` SET`
        sql = `${sql} ${entry.join(',')} ${whereCondition}`
        debug && console.log(sql);
        const conn = connect()
        try {
          conn.query(sql, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        } catch (e) {
          reject(e)
        } finally {
          conn.end()
        }
      }
    }
  })
}

module.exports = {
  querySql,
  queryOne,
  insert,
  andLike,
  and,
  betweenAnd,
  update
}