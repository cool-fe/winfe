export default {
  target: 'browser',
  cjs: { type: 'rollup', lazy: false },
  esm: { type: 'rollup' },
  umd: {
    file: 'win-request',
    minFile: true,
    sourcemap: true,
    globals: {
      axios: 'axios',
      'element-ui': 'element-ui',
      lodash: 'lodash'
    }
  },
  runtimeHelpers: true,
  disableTypeCheck: false
};
