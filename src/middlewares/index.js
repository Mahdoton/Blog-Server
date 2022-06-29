const errorHandle = require("./handle/error.js")

// 引入日志处理的包
const log4js = require("koa-log4")

// 引入解析请求头的包
const bodyParser = require("koa-body")





module.exports = [log4js.koaLogger(log4js.getLogger("http"), { level: "auto" }), errorHandle(), bodyParser()]