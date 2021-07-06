import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance, Canceler } from 'axios';
import isEqual from 'lodash/isEqual';

import { pendingRequest, refreshCookieData } from '../util';
import type { CookieData } from '../util';

const { CancelToken } = axios;

// 请求拦截，添加请求医院信息
export function requestHosiptalSoid(
  config: AxiosRequestConfig,
  user: CookieData
): AxiosRequestConfig {
  const { isAddHospitalSoid, isAddSoid } = config;
  if (isAddHospitalSoid || isAddSoid) {
    config.data.hospitalSOID = user.hospitalSOID;
  }
  return config;
}

export function requestHeader(
  config: AxiosRequestConfig,
  headerData: Record<string, unknown> = {}
): AxiosRequestConfig {
  // 添加系统参数
  config.headers.common = Object.assign(config.headers.common, headerData);
  return config;
}

export function requestCancel(config: AxiosRequestConfig): AxiosRequestConfig {
  // 添加pending
  function setPendingRequest(url: string, cancelFn: Canceler) {
    pendingRequest.set(url, {
      cancelFn,
      data: config.data,
      global: config.global || false
    });
  }
  // eslint-disable-next-line consistent-return
  config.cancelToken = new CancelToken((cancelFn): void => {
    if (typeof config.url === 'string') {
      const target = pendingRequest.get(config.url);
      /* url非重复情况 */
      if (!target) {
        setPendingRequest(config.url, cancelFn);
        return;
      }

      /* url重复 */
      // 覆盖之前的请求
      if (config.cover) {
        target.cancelFn('');
        setPendingRequest(config.url, cancelFn);
        return;
      }

      // 允许重复
      if (config.repeat) {
        const repeatList = Array.from(pendingRequest.keys()).filter(
          (url) => url.indexOf(config.url as string) !== -1
        );
        setPendingRequest(`repeat_${repeatList.length}:${config.url}`, cancelFn);
        return;
      }

      // 不允许重复则取消该请求
      if (isEqual(target.data, config.data)) {
        cancelFn(
          JSON.stringify({
            config,
            message: '请求重复',
            url: config.url,
            stack: `请求重复，入参：${JSON.stringify(config.data)}`
          })
        );
      }
    }
  });
  return config;
}

// 转换request data
// TODO 这个可以让业务直接利用拦截器处理，但是如果单个接口需要转换怎么处理？
export function requestTransform(config: AxiosRequestConfig): AxiosRequestConfig {
  const { transformData } = config;
  if (transformData) {
    config.data = transformData(config.data);
  }
  return config;
}

// check 接口入参data是否合法
// TODO 没必要传递一个checkFn参数检查参数是否合法，直接利用自定义拦截器处理
export function requestCheckData(config: AxiosRequestConfig): AxiosRequestConfig {
  const { checkFn } = config;
  if (!config.url) return config;
  const message = checkFn ? checkFn(config.data) : null;
  // 不通过 则取消该请求
  if (message) {
    const target = pendingRequest.get(config.url);
    if (target) {
      target.cancelFn(
        JSON.stringify({
          config,
          message
        })
      );
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
