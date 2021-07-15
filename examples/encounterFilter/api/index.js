// import HttpClient from './index';
// eslint-disable-next-line node/no-unpublished-import
import Request from '../../../packages/win-request';

import * as url from './url-constants';

const filterReq = new Request({
  successTxt: 'gwj'
});

filterReq
  .temp('http://localhost:8080/', {})()
  .catch((res) => console.log(111, res));

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
