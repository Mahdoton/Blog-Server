const Joi = require("joi")
exports.schema = {

  index: Joi.object({
    limit: Joi.number().min(0).default(5).error(Error("query-limit为number类型参数,最小值为0")),
    page: Joi.number().min(1).default(1).error(Error("query-page为number类型参数,最小值为1")),
    // 当type只有一个值时 single()的作用是将字符串转化为数组
    type: Joi.array().empty("").items(Joi.valid("blog", "book")).single().default(["blog", "book"])
      .error(Error("query-type为string类型且范围为[blog,book]的必需参数")),
  }),

  // 使用joi校验包进行规则校验
  create: Joi.object({
    title: Joi.string().required().error(Error("body-title为string类型必需参数")),
    synopsis: Joi.string().empty("").default("").error(Error("body-synopsis为string类型参数")),
    type: Joi.string().valid("blog", "book").required()
      .error(Error("body-type为string类型且范围为[blog,book]的必需参数")),
    content: Joi.string().empty("").default("").error(Error("body-content为string类型参数")),
  }),

  show: Joi.object({
    id: Joi.number().required().error(Error("param-id为number类型必需参数"))
  }),

  update: Joi.object({
    id: Joi.number().required().error(Error("param-id为number类型必需参数")),
    title: Joi.string().required().error(Error("body-title为string类型必需参数")),
    synopsis: Joi.string().empty("").default("").error(Error("body-synopsis为string类型参数")),
    type: Joi.string().valid("blog", "book").required()
      .error(Error("body-type为string类型且范围为[blog,book]的必需参数")),
    content: Joi.string().empty("").default("").error(Error("body-content为string类型参数")),
  }),

  destory: Joi.object({
    id: Joi.number().required().error(Error("param-id为number类型必需参数"))
  })
}