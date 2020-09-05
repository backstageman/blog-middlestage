class Article {
    constructor(data) {
        this.createArticle(data)
    }

    createArticle(data) {
        // this.id = data.id || ''
        // 文章标题
        this.title = data.title || ''
        // 文章介绍
        this.introduction = data.introduction || ''
        // 文章内容
        this.content = data.content || ''
        // 封面图片url
        this.coverImgUrl = data.coverImgUrl || ''
        // 封面图片id
        this.coverImgid = data.coverImgid || ''
        // 文章内的插图的url中间以,分隔
        this.illustrationsUrl = data.illustrationsUrl || ''
        // 文章内的插图的id以,分隔
        this.illustrationsid = data.illustrationsid || ''
        // 文章的类别id
        this.articleTypeid = data.articleTypeid || ''
        // 是否发布, 默认发布
        this.isPublish = data.isPublish
        // 文章作者
        this.createUser = data.username
        // 文章的发布时间
        this.createTime = Date.now()
        // 文章的修改时间
        this.updateTime = Date.now()
        // 文章的版本
        this.articleVersion = data.articleVersion || 1
        // 是否删除文章
        this.isDelete = data.isDelete || false
    }

    static updateArticle(newObj, oldObj) {
        // console.log('newObj',newObj);
        // console.log('oldObj',oldObj);
        oldObj.title = newObj.title
        oldObj.introduction = newObj.introduction
        oldObj.content = newObj.content
        oldObj.articleTypeid = newObj.articleTypeid
        oldObj.isPublish = newObj.isPublish
        oldObj.coverImgUrl = newObj.coverImgUrl
        oldObj.coverImgid = newObj.coverImgid
        oldObj.illustrationsUrl = newObj.illustrationsUrl
        oldObj.illustrationsid = newObj.illustrationsid
        oldObj.articleVersion = oldObj.articleVersion + 1
        oldObj.updateTime = Date.now()
        return oldObj
    }
}

module.exports = Article