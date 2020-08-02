const { querySql } = require('../db')

function findAllArticleTypes() {
  const sql = 'SELECT * FROM `article_type`'
  return querySql(sql)
}

module.exports = {
  findAllArticleTypes
}