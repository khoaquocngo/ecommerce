const app = require("./src/app");

const PORT = 6969;

const server = app.listen(PORT, () => {
    console.log(`🚀 server:: connected http://localhost:${PORT}` );
});

// process.on('SIGINT', () => {
//     server.close(() => console.log('Shut down::: express server'));

//     // notify when server shutdown or crash
        // notify.send(...)
// })