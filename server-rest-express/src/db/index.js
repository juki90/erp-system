const Sequelize = require('sequelize');
const config = require('../config');

let sequelize = {},
    db = {};

const { url, name, username, password } = config.db;

if (url) {
    sequelize = new Sequelize(url, { ...config.db });
} else {
    sequelize = new Sequelize(name, username, password, { ...config.db });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
