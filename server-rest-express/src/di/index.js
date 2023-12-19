const { ContainerBuilder, JsFileLoader } = require('node-dependency-injection');

const fs = require('fs');
const path = require('path');

const container = new ContainerBuilder();
const loader = new JsFileLoader(container);

const files = fs.readdirSync(__dirname);

files.forEach(file => {
    file = file.replace(/\.js$/, '');

    if (file === 'index') {
        return;
    }

    loader.load(path.join(__dirname, `${file}.js`));
});

module.exports = container;
