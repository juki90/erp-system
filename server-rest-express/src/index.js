const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet());

const di = require('./di');
app.set('di', di);

const router = require('./routes')(di);

require('./plugins/bodyParser')(app);
require('./plugins/cors')(app);
require('./plugins/session')(app);

app.use(router);

module.exports = app;
