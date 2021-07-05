module.exports = {
  proxy: {
    '/finance-mdm/': {
      target: 'http://172.16.6.201'
    },
    '/mdm-base/': {
      target: 'http://172.16.6.201'
    },
    '/encounter-patient/': {
      target: 'http://172.16.6.201',
      changeOrigin: true
    },
    '/app_encounter-patient1/': {
      target: 'http://172.16.6.201:41450',
      changeOrigin: true,
      pathRewrite: {
        '^/app_encounter-patient1': ''
      }
    },
    '/app_encounter-patient2/': {
      target: 'http://172.16.6.201:41404',
      changeOrigin: true,
      pathRewrite: {
        '^/app_encounter-patient2': ''
      }
    },
    '/finance-common': {
      target: 'http://172.16.6.201/finance-common',
      changeOrigin: true,
      pathRewrite: {
        '^/finance-common': ''
      }
    },
    '/person_component': {
      target: 'http://172.16.6.201',
      changeOrigin: true
    },
    '/encounter_component': 'http://172.16.6.201',
    '/base': {
      target: 'http://172.16.6.201',
      changeOrigin: true
    },
    '/outpat-encounter': 'http://172.16.6.201',
    '/schedule-outpatient': {
      target: 'http://172.16.6.201'
    },
    '/outp-finance-fee': {
      target: 'http://172.16.6.201'
    },
    '/finance-fee-inp': {
      target: 'http://172.16.6.201'
    },
    '/portal/': {
      target: 'http://172.16.6.201', // 本地指向213服务
      changeOrign: true
    },
    '/cooperation-basic': {
      target: 'http://172.16.6.201',
      changeOrigin: true
    },
    '/finance-account': {
      target: 'http://172.16.6.201'
    },
    '/encounter-mdm': {
      target: 'http://172.16.6.201'
    },
    '/outpat-person': {
      changeOrigin: true,
      target: 'http://172.16.6.201'
    },
    '/person-patient': {
      changeOrigin: true,
      target: 'http://172.16.6.201'
    },
    '/inpatient-clinical': {
      changeOrigin: true,
      target: 'http://172.16.6.201'
    },
    '/outpat': {
      changeOrigin: true,
      target: 'http://172.16.6.201'
    },
    '/web-hospital-deposit': {
      target: 'http://172.16.6.201'
    },
    '/inpatient-diagnosis': {
      changeOrigin: true,
      target: 'http://172.16.6.43'
    }
  }
};
