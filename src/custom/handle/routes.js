const Router = require("@koa/router")
const compose = require("koa-compose")
const glob = require("glob")
const { resolve } = require("path")

const routesHandle = (options = {}) => {
  const rootRouter = new Router();
  /**
   * 扫描整个routers目录
   * 对所有的路由进行自动化注册
   */
  // 拼接绝对路径
  // 过滤掉不是函数的结果
  // 对整个结果数组进行遍历处理

  const { dirPath } = options;
  // const dirPath = resolve(__dirname, "../../routers")
  const pattern = resolve(dirPath, "**/*.js")
  const routes = glob.sync(pattern)
    .map(path => require(path))
    .filter(router => typeof router === "function")
    .map(fn => {
      const router = new Router();
      fn(router);
      return router.routes();
    })
  console.log(routes)

  rootRouter.use(...routes)
  return compose([rootRouter.routes(), rootRouter.allowedMethods()])
}

module.exports = routesHandle