const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist/'),
        pathinfo: true,
    },
};
