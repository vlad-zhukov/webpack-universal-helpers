#!/usr/bin/env node

const path = require('path');
const yargs = require('yargs');
const {watchServer} = require('../dist/webpack-universal-helpers.cjs.js');

const {
    config, bundle, cwd, hot,
} = yargs
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
        hot: {
            describe: 'hot module replacement support',
            type: 'boolean',
        },
    })
    .help().argv;

// eslint-disable-next-line import/no-dynamic-require
const webpackConfig = require(path.resolve(config));

try {
    watchServer({
        webpackConfig,
        bundlePath: bundle,
        cwd,
        hot,
    });
}
catch (error) {
    console.error(error);
    process.exitCode = 1;
}
