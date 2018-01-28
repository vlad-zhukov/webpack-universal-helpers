const env = process.env.BABEL_ENV || process.env.NODE_ENV;

const presets = [];

if (env === 'production') {
    presets.unshift(
        [
            '@babel/preset-env',
            {
                targets: {node: 6},
                useBuiltIns: 'entry',
                modules: false,
                loose: false
            }
        ]
    );
}

if (env === 'test') {
    presets.unshift(
        [
            '@babel/preset-env',
            {
                targets: {node: 'current'},
                useBuiltIns: false,
                loose: false
            }
        ]
    );
}

module.exports = {presets};
