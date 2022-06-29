const context = {}

const config = require("../config.js")
context.config = config;

/**
 * 服务器成功时返回的信息
 * @param {any} data 
 * @param {number} status {默认为200}
 */
context.success = function (data, status = 200) {
  const statusIsNumber = typeof status === "number";
  if (!statusIsNumber) {
    throw new Error("返回状态码status必须是number类型")
  }
  this.status = status;
  this.body = { msg: "success", status, data };
}

/**
 * 服务器失败时返回的信息
 * @param {any} reason 
 * @param {number} status {默认为500}
 */
context.fail = function (reason, status = 500) {
  const statusIsNumber = typeof status === "number";
  if (!statusIsNumber) {
    throw new Error("返回状态码status必须是number类型")
  }
  this.status = status;
  this.body = { msg: "fail", status, reason };
}

// 引入数据库扩展
const model = require("../model/index")
context.model = model


module.exports = context