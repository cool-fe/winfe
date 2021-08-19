// import HttpClient from './index';
// eslint-disable-next-line node/no-unpublished-import
import { turn } from 'core-js/core/array';
import Request from '../../../packages/win-request';

import * as url from './url-constants';

const filterReq = new Request({
  successTxt: 'gwj'
});

const testReq = filterReq.temp(
  '/inpatient-encounter/api/v1/app_inpatient_encounter/inpatient_query_settings/update',
  {
    warning: true
  }
);

testReq({
  inpatQuerySchemeId: '142134211693117440',
  orgId: null,
  employeeId: '57393746696202243',
  appRoleCode: null,
  appSystemCode: '951678',
  visibleFlag: '98175',
  seqNo: 1,
  defaultFlag: '98176',
  queryName: '在区方案',
  queryCondition: '{"type":"in","dateRange":"8-h","dateType":"1","bedBusinessStatusList":["2"]}',
  tags: [
    {
      inpatQueryConditionTagId: '110800168291411969',
      tagId: '4303920459',
      tagName: '预出院',
      tagSeqNo: null
    },
    {
      inpatQueryConditionTagId: '141738200683304960',
      tagId: '399016400',
      tagName: '防跌倒',
      tagSeqNo: null
    },
    {
      inpatQueryConditionTagId: '139050880372695040',
      tagId: '399016399',
      tagName: '防褥疮',
      tagSeqNo: null
    },
    {
      inpatQueryConditionTagId: '110800198356183040',
      tagId: '399016535',
      tagName: '赤贫',
      tagSeqNo: null
    },
    {
      inpatQueryConditionTagId: '110800075949615105',
      tagId: '4303920452',
      tagName: '新患者',
      tagSeqNo: null
    },
    {
      inpatQueryConditionTagId: '141742600852566017',
      tagId: '399291252',
      tagName: '护理等级',
      tagSeqNo: null
    }
  ],
  tagIds: [],
  querySchemeTypeCode: '399544423',
  type: 3,
  toppingSchemeFlag: '98176'
}).catch((res) => console.log(111, res));

Request.clear();

const req = function req(arg, name) {
  return new Promise((resolve, reject) => {
    filterReq.service
      .post(name, arg)
      .then(async (res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const reqQueryCondition = function () {
  return req.call(this, ...arguments, url.QUERY_CONDITION);
};

export const requestAddnewQuery = function () {
  return req.call(this, ...arguments, url.ADD_NEW_QUERY);
};

export const requestUpdatewQuery = function () {
  return req.call(this, ...arguments, url.UPDATE_QUERY);
};

export const requestDelPlan = function () {
  return req.call(this, ...arguments, url.DELETE_PLAN);
};

//
