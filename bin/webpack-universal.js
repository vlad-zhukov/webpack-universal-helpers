#!/usr/bin/env node

const path = require('path');
const yargs = require('yargs');
const {watchServer} = require('../dist/webpack-universal-helpers.cjs.js');

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

// eslint-disable-next-line import/no-dynamic-require
const webpackConfig = require(path.resolve(config));

watchServer.start({webpackConfig, bundlePath: bundle, cwd});
