import vue from 'rollup-plugin-vue'
import { babel } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/vuefstable.umd.js',
            format: 'umd',
            name: 'vuefstable',
            exports: 'named', // 👈 bunu ekle
            globals: { vue: 'Vue' }
        },
        {
            file: 'dist/vuefstable.esm.js',
            format: 'esm',
            exports: 'named' // 👈 bunu da ekle
        }
    ],
    external: ['vue'],
    plugins: [
        vue({
            css: true,
            compileTemplate: true,
        }),
        babel({
            babelHelpers: 'bundled',
            extensions: ['.js', '.vue'],
            exclude: 'node_modules/**'
        }),
        terser()
    ]
}

