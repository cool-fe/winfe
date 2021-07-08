export default {
  target: 'browser',
  cjs: { type: 'rollup', lazy: false },
  esm: { type: 'rollup' },
  umd: {
    file: 'win-request',
    minFile: true,
    sourcemap: true
  },
  runtimeHelpers: true,
  disableTypeCheck: false
};
