const { Model, DataTypes } = require('sequelize');
const moment = require("moment");

class Article extends Model { }
module.exports = sequelize => {
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "标题"
    },
    synopsis: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "",
      comment: "简介",
    },
    type: {
      type: DataTypes.ENUM,
      values: ["blog", "book"],
      allowNull: false,
      comment: "类型[blog,book]",
    },
    content: {
      type: DataTypes.TEXT("MEDIUM"),
      allowNull: false,
      defaultValue: "",
      comment: "具体内容",
    },
    createAt: {
      type: DataTypes.STRING,
      defaultValue() {
        return moment().format("YYYY-MM-DD HH:mm")
      }
    },
    updateAt: {
      type: DataTypes.STRING,
      defaultValue() {
        return moment().format("YYYY-MM-DD HH:mm")
      }
    },

  }, {
    sequelize,
    timestamps: false,
  })
  return Article
}