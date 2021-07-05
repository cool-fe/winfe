export default {
  target: 'browser',
  cjs: { type: 'rollup', lazy: false },
  esm: { type: 'babel' },
  disableTypeCheck: false
};
