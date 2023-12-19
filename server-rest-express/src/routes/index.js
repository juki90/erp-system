const fs = require('fs');
const path = require('path');
const express = require('express');
const mainRouter = express.Router();

const basename = path.basename(__filename);

module.exports = di => {
    fs.readdirSync(__dirname)
        .filter(file => file.indexOf('.') !== 0 && file !== basename && /\.js$/.test(file))
        .forEach(file => {
            const router = require(path.join(__dirname, file))(di);
            mainRouter.use(router);
        });

    return mainRouter;
};
