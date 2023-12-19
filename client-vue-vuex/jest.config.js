module.exports = {
    moduleFileExtensions: ['js', 'json', 'vue'],
    transform: {
        '.*\\.(vue)$': 'vue-jest',
        '.*\\.(js)$': 'babel-jest'
    },
    transformIgnorePatterns: ['node_modules/(?!vue-router|@babel|vuetify)']
};
