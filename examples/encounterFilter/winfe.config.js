module.exports = {
  proxy: {
    '/inpatient-encounter/': {
      target: 'http://172.16.6.201'
    }
  }
};
