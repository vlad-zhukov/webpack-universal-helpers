import {watchServer} from '../dist/webpack-universal-helpers.esm';

test('import-bundle-esm', () => {
    expect(typeof watchServer).toBe('function');
});
