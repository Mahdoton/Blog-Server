const article = require("../controllers/article");
const { config } = require("../extend/context");
const jwt = require("koa-jwt");

/**
 * @type {Custom.IRouter}
 */
module.exports = router => {
  router.prefix("/api/articles")


  // 对jwt中间件进行注册  
  // 除了GET请求  其余请求都需要携带正确的token才能够进行操作
  router.use(
    jwt({
      secret:config.SECRET_KEY.TOKEN
    }).unless({ 
      method:["GET"]
    })
  )

  router.get("/all/archives",article.archives)

  router.get("/", article.index)
  router.get("/:id", article.show)
  router.post("/",article.create)
  router.put("/:id",article.update)
  router.del("/:id",article.destroy)
};
