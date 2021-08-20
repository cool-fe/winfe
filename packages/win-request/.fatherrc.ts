export default {
  target: 'browser',
  cjs: { type: 'rollup', lazy: false },
  esm: { type: 'rollup' },
  umd: {
    file: 'win-request',
    minFile: true,
    sourcemap: true,
    globals: { 'element-ui': 'elementUi' }
  },
  runtimeHelpers: true,
  disableTypeCheck: false,
  nodeResolveOpts: {
    browser: true,
    preferBuiltins: true
  }
};
