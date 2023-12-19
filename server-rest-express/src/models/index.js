const fs = require('fs');
const path = require('path');
const db = require('../db');

const basename = path.basename(__filename);
let modelNames = [];

fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && /\.js$/.test(file))
    .forEach(file => {
        const model = require(path.join(__dirname, file));
        db[model.name] = model;
        modelNames.push(model.name);
    });

modelNames.forEach(model => {
    db[model].associate && db[model].associate(db);
});

module.exports = db;
