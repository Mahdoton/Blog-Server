/**
 * import和export会使全局类型提示失效
 * 因为形成了局部作用域
 */
import { Middleware } from "koa";
import Router = require("@koa/router");

// import { Router } from "@koa/router";

import extendContext = require("../extend/context")

interface IMiddleware extends Middleware { };

// 泛型O是一个对象  所有使用O来声明的变量都是一个对象
interface IMiddlewareHandle<O = {}> {
  // 返回的类型是一个中间件
  (options: O): IMiddleware
}


interface IRouter {
  (router: Router): void
}



// 对controller层进行扩展
// RESTful API
type DefaultControllerTypes = "index" | "show" | "create" | "update" | "destroy";
type Controller<U = {}> = {
  // 在controller层提供中间价类型提示
  [P in DefaultControllerTypes | U]?: IMiddleware
}

/**
 * 给ctx做类型提示
 */
declare module "koa" {
  // 对ctx进行接口扩展
  type extendContextExtends = typeof extendContext;
  // 改进做法  使用继承extendContextExtends的方法
  // 本质上是利用原型进行扩展
  interface DefaultContext extends extendContextExtends,
    Router.RouterParamContext {
    // 原始做法
    // success: (data: any, status: number) => void,
    // fail: (reason: any, status: number) => void
  }
}



export as namespace Custom

