import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
    input: './src/index.js',
    plugins: [babel()],
    external: ['webpack', 'yargs', 'execa', 'path'],
    sourcemap: true,
    output: [
        {
            file: pkg.main,
            format: 'cjs',
        },
        {
            file: pkg.module,
            format: 'es',
        },
    ],
};
