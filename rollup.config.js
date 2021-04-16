import resolve from '@rollup/plugin-node-resolve';
import cjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.js',
  output: {
    dir: 'public/',
    format: 'iife',
  },
  plugins: [
    cjs(),
    resolve(),
    css({ output: 'style.css' }),
    copy({
      targets: [
        { src: 'node_modules/leaflet/dist/images/*', dest: 'public/images/' },
      ]
    })
  ],
};
