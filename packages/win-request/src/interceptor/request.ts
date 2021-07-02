import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance } from 'axios';
import isEqual from 'lodash/isEqual';

import { pendingRequest, refreshCookieData } from '../util';
import type { CookieData } from '../util';

const { CancelToken } = axios;

// 请求拦截，添加请求医院信息
export function requestHosiptalSoid(
  config: AxiosRequestConfig,
  user: CookieData
): AxiosRequestConfig {
  //@ts-ignore
  if (config.options) {
    //@ts-ignore
    const { isAddHospitalSoid, isAddSoid } = config.options;
    config.data = config.data || {};
    if (isAddHospitalSoid || isAddSoid) {
      config.data.hospitalSOID = user.hospitalSOID;
    }
  }
  return config;
}

// 请求拦截，添加请求头信息
export function requestHeader(
  config: AxiosRequestConfig,
  headerData: any = {}
): AxiosRequestConfig {
  // 添加系统参数
  config.headers.common = Object.assign(config.headers.common, headerData);
  return config;
}

// 请求拦截，防止重复请求
export function requestCancel(config: any) {
  const { options } = config;
  // 添加pending
  function setPendingRequest(url: string, cancelFn: any) {
    config.storeUrl = url;
    pendingRequest.set(url, {
      cancelFn,
      data: config.data,
      global: options.global || false
    });
  }
  // eslint-disable-next-line consistent-return
  config.cancelToken = new CancelToken((cancelFn) => {
    const target = pendingRequest.get(config.url);
    /* url非重复情况 */
    if (!target) {
      setPendingRequest(config.url, cancelFn);
      return config;
    }
    /* url重复 */
    // 覆盖之前的请求
    if (options.cover) {
      target.cancelFn('');
      setPendingRequest(config.url, cancelFn);
      return config;
    }
    // 允许重复
    if (options.repeat) {
      const repeatList = Array.from(pendingRequest.keys()).filter(
        (url) => url.indexOf(config.url) !== -1
      );
      setPendingRequest(`repeat_${repeatList.length}:${config.url}`, cancelFn);
      return config;
    }
    // 不允许重复则取消该请求
    if (isEqual(target.data, config.data)) {
      //@ts-ignore
      cancelFn({
        config,
        message: '请求重复',
        url: config.url,
        stack: `请求重复，入参：${JSON.stringify(config.data)}`
      });
    }
  });
  return config;
}

// 转换request data
export function requestTransform(config: any): AxiosRequestConfig {
  const {
    options: { transformData }
  } = config;
  if (transformData) {
    config.data = transformData(config.data);
  }
  return config;
}

// check 接口入参data是否合法
export function requestCheckData(config: any): AxiosRequestConfig {
  const {
    options: { checkFn }
  } = config;
  const message = checkFn ? checkFn(config.data) : null;
  // 不通过 则取消该请求
  if (message) {
    const target = pendingRequest.get(config.storeUrl || config.url);
    if (target) {
      target.cancelFn({
        config,
        message
      });
    }
  }
  return config;
}

// 请求拦截
const requestInterceptor = (service: AxiosInstance): void => {
  service.interceptors.request.use((config) => {
    const { header, user } = refreshCookieData();
    let dealedConfig: AxiosRequestConfig = {};
    // 统一添加请求头
    dealedConfig = requestHeader(config, header);
    // 处理统一添加集团医院ID
    dealedConfig = requestHosiptalSoid(dealedConfig, user);
    // 添加修改接口入参 data 的fn
    dealedConfig = requestTransform(dealedConfig);
    // 处理借口重复问题
    dealedConfig = requestCancel(dealedConfig);
    // 检查数据是否合法
    dealedConfig = requestCheckData(dealedConfig);
    return dealedConfig;
  });
};

export default requestInterceptor;
