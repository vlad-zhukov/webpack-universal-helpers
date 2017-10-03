const path = require('path');
const yargs = require('yargs');
const watchServer = require('../dist/webpack-universal-helpers.cjs.js');

const {config, bundle, cwd} = yargs
    .options({
        config: {
            default: 'webpack.config.js',
            describe: 'path to webpack config',
            type: 'string',
        },
        bundle: {
            describe: 'path to bundle',
            demandOption: true,
            type: 'string',
        },
        cwd: {
            describe: 'path to working directory the bundle will be executed in',
            type: 'string',
        },
    })
    .help().argv;

console.log('Loading Webpack config...');

const configPath = path.resolve(config);

// eslint-disable-next-line import/no-dynamic-require
let webpackConfig = require(configPath);
if (typeof webpackConfig === 'object' && typeof webpackConfig.default === 'object') {
    // Normalize default export
    webpackConfig = webpackConfig.default;
}

// if (!bundlePath) {
//     console.error('Webpack config file must export an object with ‘output.path’.');
//     process.exit(1);
// }

watchServer({webpackConfig, bundlePath: bundle, cwd});
