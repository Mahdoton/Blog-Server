
const CustomKoa = require("./custom/app.js")
// 引入需要注册的中间件
const middlewares = require("./middlewares/index.js")
const { resolve } = require("path")
const context = require("./extend/context.js")

const app = new CustomKoa();


// middlewares.forEach(middleware => {
//   app.use(middleware)
// })
// 形参一一对应  可缩写
// middlewares.forEach(app.use, app);


// 注册多个中间件 middlewares是一个数组
app.useMiddleWares(middlewares);

// 注册多个路由
app.useRouters(resolve(__dirname, "./routers"));

// ctx扩展多个属性
app.extendContext(context);

// 开启app级别的日志应用
app.useLogger(resolve(__dirname, "../logs"))


module.exports = { server: app };
