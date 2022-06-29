const user = require("../controllers/user");

/**
 * @type {Custom.IRouter}
 */
module.exports = router => {
  router.prefix("/api/users")
  router.post("/login", user.login)
};