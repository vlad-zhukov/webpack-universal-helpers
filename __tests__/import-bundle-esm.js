import {nodeExternals, watchServer} from '../dist/webpack-universal-helpers.esm';

test('import-bundle-esm', () => {
    expect(typeof nodeExternals).toBe('function');
    expect(typeof watchServer).toBe('object');
});
