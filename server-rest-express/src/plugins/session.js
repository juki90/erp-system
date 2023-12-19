const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const config = require('../config');
const client = redis.createClient();

module.exports = app => {
    const threeHoursInMs = 3600 * 1000 * 3;
    const { host, port, pass } = config.redis;

    app.set('redisClient', client);

    const sessionData = {
        store: new redisStore({ host, port, client, pass, ttl: 260 }),
        secret: config.session.secret,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: threeHoursInMs
        }
    };

    if (config.app.env === 'production') {
        app.set('trust proxy', 1);
        sessionData.cookie.secure = true;
    }

    app.use(session(sessionData));
};
