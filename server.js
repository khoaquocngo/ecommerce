const app = require("./src/app");
const config = require('./src/configs/config.container')


const server = app.listen(config.port, () => {
    console.log(`🚀 server:: connected ${config.host}:${config.port}` );
});

// process.on('SIGINT', () => {
//     server.close(() => console.log('Shut down::: express server'));

//     // notify when server shutdown or crash
//     // notify.send(...)
// })