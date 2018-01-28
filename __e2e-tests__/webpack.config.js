const path = require('path');
const {nodeExternals} = require('webpack-universal-helpers');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist/'),
        pathinfo: true,
    },
    target: 'node',
    externals: [
        nodeExternals({
            whitelist: ['webpack-universal-helpers'],
        }),
    ]
};
