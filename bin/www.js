const { server } = require("../src/index.js")

const { PORT } = server.context.config;
const listenHandle = () => console.log(`${PORT}服务已开启`);
server.listen(PORT, listenHandle)
