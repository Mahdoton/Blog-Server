const Koa = require("koa");

const routesHandle = require("./handle/routes.js");

const log4js = require("koa-log4");

const { resolve } = require("path")



class CustomKoa extends Koa {
  /**
   * 批量注册中间件
   * @param {import("Koa").Middleware=[]} middlewares 
   */
  useMiddleWares(middlewares = []) {
    // middlewares.forEach(middleware => this.use(middleware))
    middlewares.forEach(this.use, this)
  }


  /**
   * 路由自动化加载  
   * @param {string} dirPath 
   */
  useRouters(dirPath) {
    const dirPathIsString = typeof dirPath === "string"
    if (!dirPathIsString) {
      throw new Error("路由目录dirPath为string类型必需参数")
    }
    this.use(
      routesHandle({ dirPath })
    )
  }


  /**
   * ctx扩展
   * @param {object} props 
   */
  extendContext(props) {
    for (const key in props) {
      if (Object.hasOwnProperty.call(props, key)) {
        const hasProp = Boolean(this.context[key])
        if (hasProp) {
          throw new Error("原context已有该属性,请更换扩展属性名称")
        }
        this.context[key] = props[key];
      }
    }
  }

  /**
   * 日志处理支持
   * @param {string} dirPath 
   */
  useLogger(dirPath) {
    const dirPathIsString = typeof dirPath === "string";
    if (!dirPathIsString) {
      throw new Error("日志目录路径必须为string类型必需参数")
    }
    log4js.configure({
      pm2: true,
      disableClustering: true,
      appenders: {
        access: {
          type: "dateFile",
          pattern: "-yyy-MM-dd.log",
          alwaysIncludePattern: true,
          daysToKeep: 60,
          filename: resolve(dirPath, "access/access.log")
        },
        app: {
          type: "dateFile",
          pattern: "-yyy-MM-dd.log",
          alwaysIncludePattern: true,
          daysToKeep: 60,
          filename: resolve(dirPath, "aplication/error.log")
        }
      },
      categories: {
        default: {
          appenders: ["access"], level: "info"
        },
        app: {
          appenders: ["app"], level: "WARN"
        }
      }
    })

    const appLogger = log4js.getLogger("app");
    this.on("error", err => appLogger.error(err))
  }
}

module.exports = CustomKoa;