export default {
  input: 'EventTarget.js',
  external: ['three'],
  output: [{
    file: './dist/EventTarget.js',
    format: 'umd',
    name: 'EventTarget',
  }, {
    file: './dist/EventTarget.module.js',
    format: 'es',
  }]
};
