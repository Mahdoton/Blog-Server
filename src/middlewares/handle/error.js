/**
 * @type {Custom.IMiddlewareHandle<{bar:number}>}
 */


const errorHandle = (options = {}) => {
  return async (ctx, next) => {
    try {
      // 捕捉后续中间件的错误
      // 对后续注册的中间件进行错误处理
      await next();
      const { body, status } = ctx;
      const isNotFound = status === 404 && !body;
      if (isNotFound) {
        ctx.success("资源未找到", status)
        // ctx.body = {
        //   msg: "success",
        //   status,
        //   data: "资源未找到"
        // }
      }
    } catch (error) {
      // 如果是服务端错误
      let { status = 500, message } = error;

      const parameterErrorKeywords = [
        "body",
        "query",
        "param"
      ];

      const isParameterError = parameterErrorKeywords.some(
        keyword => message.includes(keyword)
      )

      if (isParameterError) {
        status = 400;
      }

      // 判断是否token权限错误
      const AuthenticationError = "Authentication Error";

      const isAuthenticationError = message === AuthenticationError;
      if (isAuthenticationError) {
        message = "用户未登录,请先登录"
      }


      const isProd = ctx.app.env === "production";

      const isServerError = status === 500;

      const isProdServerError = isProd && isServerError;


      const displayableError = [
        isAuthenticationError,
        isParameterError
      ].includes(true);

      if (!displayableError && isProdServerError) {
        ctx.app.emit("error", { message, status })
        message = "服务端错误"
      }

      ctx.status = status;

      ctx.fail(message, status);
      // ctx.body = {
      //   msg: "fail",
      //   status,
      //   reson: message
      // }

      ctx.app.emit("error", { message, status, })
      // 由于错误被捕捉到了  需要将错误抛出进行日志处理
      // ctx.app.emit("error",error)
    }
  }
}

module.exports = errorHandle;