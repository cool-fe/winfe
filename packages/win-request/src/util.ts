import Cookie from 'js-cookie';

export interface CookieData {
  [key: string]: string | undefined;
}

export interface ErrorInfoStructure {
  success: boolean; // if request is success
  data?: unknown; // response data
  errorCode?: string; // code for errorType
  errorMessage?: string; // message display to user
  showType?: number; // error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
  traceId?: string; // Convenient for back-end Troubleshooting: unique request ID
  host?: string; // onvenient for backend Troubleshooting: host of current access server
  detailMsg?: string;
  message?: string;
  type: string;
  path: string;
  id: string;
  stack?: string[];
  code: string;
  response: any;
}

const cookieExternals = {
  userInfo: true,
  BEARER_TOKEN: true,
  usersInfoId: true
};

/**
 * 根据key获取带默认值的cookie
 * @param {String} key
 * @param {String} value 当前key的cookie值，如果传入则不再去cookie中拿
 * @returns
 */

// eslint-disable-next-line complexity
function getCookieByKeyInDefault(key: string, value?: string): string | undefined {
  const data = value || Cookie.get(key);
  switch (key) {
    case 'W-SEQ':
      return data || '1569595974015_2';
    case 'W-FLOW':
      return data || 'default';
    case 'X-DEBUG' || 'W-EVENT':
      return data;
    case 'Authorization':
      return getCookieByKeyInDefault('BEARER_TOKEN');
    case 'BEARER_TOKEN':
      return data;
    case 'ip':
      return data || 'http://127.0.0.1';
    default:
      return data ? encodeURI(data).replace(/%20/g, ' ') : '';
  }
}

/**
 * 获取cookieData
 */
function getCookie(): CookieData {
  const cookieData: CookieData = {};
  const cookie = Cookie.get();
  // 遍历所有key
  // eslint-disable-next-line no-restricted-syntax
  for (const key in cookie) {
    if (Object.hasOwnProperty.call(cookie, key)) {
      if (!cookieExternals[key]) {
        cookieData[key] = getCookieByKeyInDefault(key, cookie[key]);
      }
    }
  }
  // 拼装Authorization
  cookieData.Authorization = getCookieByKeyInDefault('Authorization');
  return cookieData;
}

export function getUserInfo(): CookieData {
  let userInfo = Cookie.get('userInfo');
  try {
    userInfo = userInfo ? JSON.parse(userInfo) : {};
  } catch (e) {
    userInfo = {};
    console.log(e);
  }
  return userInfo;
}

export function getRequestHeader(): CookieData {
  return {
    ...getCookie(),
    ip: getCookieByKeyInDefault('ip')
  };
}

export const COOKIE_DATA = {
  user: getUserInfo(),
  header: getRequestHeader()
};

// 获取cookie 数据
export function getCookieData(): typeof COOKIE_DATA {
  return COOKIE_DATA;
}

// 存储pending 状态请求
export const pendingRequest: Map<string, any> = new Map();

/**
 * 刷新请求头信息
 */
export function refreshCookieData(): typeof COOKIE_DATA {
  // 判断重新登陆情况下重新获取, W-EVENT 改变 自动重新获取 W-EVENT
  if (
    Cookie.get('BEARER_TOKEN') !== COOKIE_DATA.header.Authorization ||
    (Cookie.get('W-EVENT') && Cookie.get('W-EVENT') !== COOKIE_DATA.header['W-EVENT'])
  ) {
    COOKIE_DATA = {
      user: getUserInfo() || {},
      header: getRequestHeader()
    };
  }
  return COOKIE_DATA;
}

/**
 * 清除所有pending状态的请求
 * @param {Array} whileList 白名单，里面的请求不会被取消
 */
export function clearPendingRequest(whiteList: string[] = []): string[] | undefined {
  if (!pendingRequest.size) return;
  const pendingUrlList = Array.from(pendingRequest.keys()).filter((url) => {
    const cancelList = whiteList.find((whiteUrl) => url.indexOf(whiteUrl) !== -1);
    return !cancelList || !cancelList.length;
  });
  if (!pendingUrlList.length) return;
  pendingUrlList.forEach((pendingUrl) => {
    // 清除掉所有非全局的pending状态下的请求
    if (!pendingRequest.get(pendingUrl).global) {
      pendingRequest.get(pendingUrl).cancelFn('');
      pendingRequest.delete(pendingUrl);
    }
  });
  // eslint-disable-next-line consistent-return
  return pendingUrlList;
}

interface ErrorMessageOptions {
  successTxt?: string;
  failTxt?: string;
  showDetail?: boolean;
  duration?: number;
}
export type MessageInstance = (options: unknown) => unknown;

/**
 *
 * @param {Function} message 消息弹窗方法
 * @param {Object} err 错误信息对象
 * @param {String} err.message 错误提示信息
 * @param {Object} options 消息弹窗配置对象
 * @param {Boolean} options.showDetail 是否展示错误详情
 * @param {Boolean} options.showClose 是否展示关闭按钮
 */
export const showErrMessage = (
  message: MessageInstance,
  err: ErrorInfoStructure,
  options: ErrorMessageOptions = {}
): void => {
  if (!err) return;
  const { detailMsg } = err;
  message({
    message: err.message || options.failTxt,
    type: err.type || 'error',
    showDetail: options.showDetail !== false,
    errorUrl: err.path || null,
    detailMsg: detailMsg || null,
    traceid: err.id || null,
    duration: options.duration || 5000
  });
};

export const showSuccessMessage = (
  message: MessageInstance,
  options: ErrorMessageOptions
): void => {
  message({
    message: options.successTxt,
    type: 'success',
    duration: options.duration || 5000
  });
};

// eslint-disable-next-line complexity
export const handleError = (err: ErrorInfoStructure): ErrorInfoStructure => {
  if (err.stack && err.stack.includes('timeout')) {
    err.message = '请求超时!';
  }
  const { response } = err;
  if (!response) return err;
  if (!response.status) {
    err.code = '';
    err.message = '未知错误：有response但没有response.status';
  }

  switch (response.status) {
    case 400:
      err.message = '请求错误（400）';
      break;
    case 401:
      err.message = '未授权，请重新登录(401)';
      break;
    case 403:
      err.message = '拒绝访问(403)';
      break;
    case 404:
      err.message = '请求出错(404)';
      break;
    case 408:
      err.message = '请求超时(408)';
      break;
    case 500:
      err.message = '服务器错误(500)';
      break;
    case 501:
      err.message = '服务未实现(501)';
      break;
    case 502:
      err.message = '网络错误(502)';
      break;
    case 503:
      err.message = '服务不可用(503)';
      break;
    case 504:
      err.message = '网络超时(504)';
      break;
    default:
      err.message = `连接出错，状态码：(${err.response.status})!`;
  }
  return err;
};
