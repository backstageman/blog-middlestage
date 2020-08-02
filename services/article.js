const Article = require('../model/Article')
const db = require('../db')
const { debug } = require('../utils/constant')

function exists(article) {
    const { title } = article
    const sql = `select * from article where title=\`${title}\` `
    return db.queryOne(sql)
}

function insertArticle(article) {
    return new Promise(async (resolve, reject) => {
        try {
            if (article instanceof Article) {
                // 插入文章重复的时候，删除之前的记录
                // await db.removeArticle(article, 'article')
                const result = await exists(article)
                if (result) {
                    reject(new Error('文章已经存在'))
                } else {
                    await db.insert(article, 'article')
                    resolve()
                }
            } else {
                reject(new Error('添加的文章对象不合法'))
            }
        } catch (e) {
            reject(e)
        }
    })
}

// function removeArticle(article) {
//     if (article) {
//         // 删除文章内的图片和封面图片文件
//         // 删除数据库中的记录
//         article.reset()
//         if(article.coverImgUrl && article.coverImgid){
//             // 删除
//         }
//     }
// }

async function getArticleList(query) {
    // debug && console.log(query);
    const {
        title,
        introduction,
        content,
        articleType,
        createTimeStart,
        createTimeEnd,
        updateTimeStart,
        updateTimeEnd,
        page = 1,
        pageSize = 10
    } = query
    const offset = (page - 1) * pageSize
    let queryListSql = `
                SELECT 
                    art.id,
                    title,
                    introduction,
                    content,
                    coverImgUrl,
                    coverImgid,
                    illustrationsid,
                    illustrationsUrl,
                    isPublish,
                    createUser,
                    createTime,
                    updateTime,
                    isDelete,
                    typeName
                from article as  art
                left JOIN article_type as  artype
                on  art.articleTypeid = artype.id
                where isDelete != 'true'
    `
    let whereCondition = ""
    title && (whereCondition = db.andLike(whereCondition, 'title', title))
    introduction && (whereCondition = db.andLike(whereCondition, 'introduction', introduction))
    content && (whereCondition = db.andLike(whereCondition, 'content', content))
    articleType && (whereCondition = db.and(whereCondition, 'articleType', articleType))
    if (createTimeStart && createTimeEnd) {
        whereCondition = db.betweenAnd(whereCondition, 'createTime', createTimeStart, createTimeEnd,)
    }
    if (updateTimeStart && updateTimeEnd) {
        whereCondition = db.betweenAnd(whereCondition, 'updateTime', updateTimeStart, updateTimeEnd,)
    }
    if (whereCondition !== '') {
        queryListSql = `${queryListSql} ${whereCondition}`
    }
    let countSql = " select count(*) as count from article where isDelete != 'true' "
    if (whereCondition !== '') {
        countSql = `${countSql} ${whereCondition}`
    }
    debug && console.log(countSql);
    const countResult = await db.querySql(countSql)
    queryListSql = `${queryListSql} limit ${pageSize} offset ${offset}`
    debug && console.log(queryListSql);
    const list = await db.querySql(queryListSql)
    return { list, total: countResult[0].count, page, pageSize }
}

function deleteArticle(id, userObj) {
    return new Promise(async (resolve, reject) => {
        let article = await findArticleById(id)
        if (article) {
            if (article.createUser !== userObj.username) {
                reject(new Error('抱歉，您没有权限删除别人的文章'))
            } else {
                const sql = `
                update article set isDelete='true'
                where id = '${id}'
            `
                db.querySql(sql).then(res => {
                    resolve(res)
                })
            }
        } else {
            reject(new Error('文章不存在'))
        }
    })
}

function findArticleById(id) {
    return new Promise(async (resolve, reject) => {
        const ArticleGetOneSql = `select * from article where id='${id}'`
        const article = await db.queryOne(ArticleGetOneSql)
        if (article) {
            resolve(article)
        } else {
            reject(new Error('文章不存在'))
        }
    })
}

function updateArticle(article) {
    return new Promise(async (resolve, reject) => {
        const result = await exists(article)
        try {
            await db.update(article, 'article', `where id='${article.id}'`)
            resolve()
        } catch (error) {
            reject(new Error('更新文章出错，请稍后重试'))
        }
    })
}


module.exports = {
    insertArticle,
    getArticleList,
    deleteArticle,
    findArticleById,
    updateArticle
}