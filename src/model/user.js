const { Model, DataTypes } = require('sequelize');
const moment = require("moment");

const {sha256Hash} = require("../tools/hash")
const config = require("../config")


class User extends Model { }

module.exports = sequelize => {
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "用户名"
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "密码",
      // 对密码进行加密
      set(val) {
        const newVal = sha256Hash(
          val, config.SECRET_KEY.PASSWORD
        )
        this.setDataValue("password", newVal)
      }
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
  return User
}