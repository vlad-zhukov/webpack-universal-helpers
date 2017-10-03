import {watchServer} from '../dist/webpack-universal-helpers.cjs';

test('import-bundle-esm', () => {
    expect(typeof watchServer).toBe('function');
});
