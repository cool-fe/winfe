export default {
  target: 'browser',
  cjs: { type: 'rollup', lazy: false },
  esm: { type: 'rollup' },
  umd: {
    file: 'win-request',
    minFile: true,
    sourcemap: true,
    globals: { 'element-ui': 'element-ui' }
  },
  runtimeHelpers: true,
  disableTypeCheck: false
};
