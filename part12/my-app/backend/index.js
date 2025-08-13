const config = require('./utils/config.js');
const logger = require('./utils/logger.js');
const app = require('./app.js')

app.listen(config.PORT, logger.serverInit(config.PORT))