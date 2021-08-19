module.exports = {
  proxy: {
    '/base': {
      // target: 'http://172.16.6.201'
      target: 'http://172.16.7.59'
    },
    '/inpatient-encounter/': {
      // target: 'http://172.16.6.201'
      target: 'http://172.16.7.59'
    }
  }
};
