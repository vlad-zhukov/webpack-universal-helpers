const {watchServer} = require('../dist/webpack-universal-helpers.cjs');

test('import-bundle-cjs', () => {
    expect(typeof watchServer).toBe('function');
});
