const { Sequelize } = require('sequelize');
const moment = require("moment");

const useUser = require("./user")
const useArticle = require("./article")


const config = require("../config")

// 连接数据库
const sequelize = new Sequelize({
  ...config.MODEL,
  hooks: {
    beforeUpdate(instance) {
      instance.set("updateAt", moment().format("YYYY-MM-DD HH:mm"))
    }
  }
});

// 初始化表表
const User = useUser(sequelize)
const Article = useArticle(sequelize)

// 做关联操作
User.hasMany(Article)
Article.belongsTo(User)

// 创建数据库表
sequelize.sync({
  alter: true
});

(async () => {
  const user = await User.findOne({
    where: { username: "Mahdoton" }
  })

  if (user) {
    return
  }

  await User.create({
    username: "Mahdoton",
    password: "flzx3qc_LTB"
  })
})()


module.exports = { User, Article }