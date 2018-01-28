const {nodeExternals, watchServer} = require('../dist/webpack-universal-helpers.cjs');

test('import-bundle-cjs', () => {
    expect(typeof nodeExternals).toBe('function');
    expect(typeof watchServer).toBe('object');
});
