const Joi = require("joi")
exports.schema = {
  // 使用joi校验包进行规则校验
  login: Joi.object({
    username: Joi.string().max(10).required().error(
      Error("body-username为string必需参数,最大为10位")
    ),
    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[a-z])(?=.*\d)[^]{8,16}$/).required().error(
        Error("body-password为string必需参数,格式为两个小写字母开头,至少8位至多16位")
      )
  })
}