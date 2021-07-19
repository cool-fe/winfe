/*
 * @Author: jun.fu<fujunchn@qq.com>
 * @LastEditors: jun.fu<fujunchn@qq.com>
 * @Description: file content
 * @Date: 2021-04-26 16:01:47
 * @LastEditTime: 2021-04-27 11:57:30
 * @FilePath: /winning-webcomponents-finance-common/src/utils/cookieData.js
 */

import Cookie from 'js-cookie';

const cookieExternals = {
  userInfo: true,
  BEARER_TOKEN: true,
  usersInfoId: true
};

/**
 * 根据key获取指定cookie
 * @param {String} key
 * @returns
 */
function getCookieByKey(key: string): string {
  return Cookie.get(key) || '';
}

/**
 * 根据key获取带默认值的cookie
 * @param {String} key
 * @param {String} value 当前key的cookie值，如果传入则不再去cookie中拿
 * @returns
 */
// eslint-disable-next-line complexity
function getCookieByKeyInDefault(key: string, value?: string | undefined): any {
  const data = value || getCookieByKey(key);
  // const data = copydata ? encodeURI(copydata).replace(/%20/g, ' ') : copydata
  switch (key) {
    case 'W-SEQ':
      return data || '1569595974015_2';
    case 'W-FLOW':
      return data || 'default';
    case 'X-DEBUG' || 'W-EVENT':
      return data || null;
    case 'Authorization':
      return getCookieByKeyInDefault('BEARER_TOKEN');
    case 'BEARER_TOKEN':
      return data;
    case 'ip':
      return data || 'http://127.0.0.1';
    default:
      return data ? encodeURI(data).replace(/%20/g, ' ') : data;
  }
}

/**
 * 获取cookieData
 */
function getCookieData(): any {
  const cookieData: any = {};
  const cookie = Cookie.get();
  // 遍历所有key
  // eslint-disable-next-line no-restricted-syntax
  for (const key in cookie) {
    if (Object.hasOwnProperty.call(cookie, key)) {
      if (cookieExternals[key]) {
        // eslint-disable-next-line no-continue
        continue;
      }
      cookieData[key] = getCookieByKeyInDefault(key, cookie[key]);
    }
  }

  // 拼装Authorization
  cookieData.Authorization = getCookieByKeyInDefault('Authorization');

  return cookieData;
}

export default getCookieData();

export { getCookieByKeyInDefault, getCookieData, getCookieByKey };
