const user = require("../routers/user");
const { schema } = require("../pipe/user")

const { sha256Hash } = require("../tools/hash")

const jsonwebtoken = require("jsonwebtoken")


/**
 * @type {Custom.Controller<"login">}
 */
module.exports = {
  async login(ctx, next) {
    // ctx.request.body是请求头解析出来的参数对象
    const res = await schema.login.validateAsync(ctx.request.body)
    // 当规则验证不通过时  下面的语句都不会去执行
    // ctx.success(res);

    const { username, password } = res;

    // 此处返回的user相当于是用户表的对象  
    const user = await ctx.model.User.findOne({
      where: { username, }
    })
    if (!user) {
      return ctx.fail("用户不存在,请重新确认用户名", 400);
    }

    // console.log(user.username)
    // console.log(user.password)
    // console.log(password)
    // console.log(sha256Hash(password, ctx.config.SECRET_KEY))

    const passwordIsEqual = user.password === sha256Hash(password, ctx.config.SECRET_KEY.PASSWORD);

    if (!passwordIsEqual) {
      return ctx.fail("密码不正确,请重新确认密码", 400)
    }


    // 定制token
    const payload = {
      id: user.id,
      username: user.username,
    }

    // 生成token  做数字签名 
    // expiresIn is deadtime
    const token = jsonwebtoken.sign(payload, ctx.config.SECRET_KEY.TOKEN, { expiresIn: "7d" })

    ctx.success({ ...payload, token });

    await next();

  }
}