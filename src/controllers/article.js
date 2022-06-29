const { Sequelize ,Op} = require("sequelize");
const { schema } = require("../pipe/article")

/**
 * @type {Custom.Controller<"archives">}
 */
module.exports = {
  // 显示全部文章
  async index(ctx, next) {
    // console.log(ctx.query)
    const { limit, page, type } = await schema.index.validateAsync(ctx.query);

    // 计算偏移量  
    // 当页数为1时  
    // const offset = (page - 1) ? limit : limit * (page - 1)
    const offset = limit * (page - 1)
    // const offset = page - 1;

    const article = await ctx.model.Article.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
      where: { type }
    })
    ctx.success(article);
    await next();
  },


  // 显示在规定条件范围内的文章
  async show(ctx, next) {
    // ctx.success(id)
    const { id } = await schema.show.validateAsync(ctx.params)
    // 查找对应id的文章  并且返回作者信息
    const article = await ctx.model.Article.findByPk(id, {
      include: {
        model: ctx.model.User,
        attributes: { exclude: ["password"] }
      }
    })

    if (!article) {
      return ctx.success("文章未找到,请确认文章id", 404)
    }

    ctx.success(article);
    await next();

  },

  // 创建文章
  async create(ctx, next) {
    // 通过ctx.state可以拿到当前用户的基本信息
    // console.log(ctx.state)
    // user: { id: 2, username: 'Mahdoton', iat: 1647770625, exp: 1648375425 }
    const { id: UserId } = ctx.state.user;

    // ctx.request.body为请求头的数据
    // console.log(ctx.request.body)
    // 对文章参数进行验证
    const newInfo = await schema.create.validateAsync(ctx.request.body)

    const article = await ctx.model.Article.create({
      ...newInfo,
      UserId
    })

    ctx.success(article);


    await next();
  },

  // 更新文章
  async update(ctx, next) {
    // ctx.success(ctx.params)
    // console.log(ctx.state.user)
    // console.log(ctx.request.body)
    const { id: UserId } = ctx.state.user;
    // 对前端数据进行校验解析
    const { id, ...newInfo } = await schema.update.validateAsync({
      ...ctx.params,
      ...ctx.request.body
    })

    // 对数据库进行查找
    const article = await ctx.model.Article.findByPk(id)

    if (!article) {
      return ctx.fail("更新文章失败,文章未找到,请确认文章id", 400)
    }

    // 当文章所属用户id和当前发起请求的用户id一致时
    // 文章才能够被更改
    const userIdIsEqual = article.UserId === UserId;

    if (!userIdIsEqual) {
      return ctx.fail("该用户无权限更新此文章", 401)
    }

    // 更新数据库
    await article.update(newInfo);

    ctx.success(article, 201);

    await next();

  },

  // 删除文章
  async destroy(ctx, next) {
    const { id: UserId } = ctx.state.user;

    const { id } = await schema.destory.validateAsync(ctx.params);

    const article = await ctx.model.Article.findByPk(id);

    // console.log(article)
    if (!article) {
      return ctx.fail("删除文章失败,文章未找到,请确认文章id", 400)
    }

    const userIdIsEqual = article.UserId === UserId;

    if (!userIdIsEqual) {
      return ctx.fail("该用户无权限删除此文章", 401)
    }

    await article.destroy();

    ctx.success(null, 204);

    await next();
  },

  async archives(ctx, next) {
    // ctx.success("test")
    const articles = await ctx.model.Article.findAll({
      order: [["id", "DESC"]],
      group: Sequelize.fn(
        "date_format",
        Sequelize.col("createAt"),
        "%Y-%m"
      ),
      attributes: [
        [
          Sequelize.fn(
            "date_format",
            Sequelize.col("createAt"),
            "%Y-%m"
          ),
          "month"
        ]
      ],
      raw: true
    })
    for (const item of articles) {
      item.data = await ctx.model.Article.findAll({
        order: [["id", "DESC"]],
        where:{
          createAt:{
            [Op.like]:`${item.month}%`
          }
        },
        attributes:[
          "id",
          "title",
          [
            Sequelize.fn(
              "date_format",
              Sequelize.col("createAt"),
              "%Y-%m-%d"
            ),
            "createAt"
          ]
        ]
      })
    }
    ctx.success(articles);
    await next();
  }
}