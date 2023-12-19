const app = require('../index');
const config = require('../config');

const serverShutdown = require('../utilities/serverShutdown');

const httpServer = app.listen(config.app.port, () => console.log(`APP is listening on port: ${config.app.port}`));

process.on('SIGINT', () => serverShutdown(httpServer));
process.on('SIGTERM', () => serverShutdown(httpServer));
