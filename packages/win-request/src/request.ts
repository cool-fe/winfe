import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';

import {
  getCookieData as getCookieDataUtil,
  showErrMessage,
  clearPendingRequest,
  noop
} from './util';

import type { COOKIE_DATA, MessageInstance } from './util';

import requestInterceptor from './interceptor/request';
import responseInterceptor from './interceptor/response';

declare module 'axios' {
  export interface AxiosResponse {
    success: boolean;
    traceid: string;
    errorDetail: {
      id: string;
      path?: string;
      detailMsg?: string;
      fixMsg?: string;
      ipAddress?: string;
      message?: string;
      original?: string;
    };
    appid: string;
    hostip: string;
  }

  export interface AxiosError {
    stack?: unknown[];
    type?: string;
  }

  export interface AxiosRequestConfig {
    successTxt?: string;
    failTxt?: string;
    warning?: boolean;
    cover?: boolean;
    repeat?: boolean;
    isAddHospitalSoid?: boolean;
    isAddSoid?: boolean;
    baseUrl?: string;
    message?: MessageInstance;
    global?: boolean;
    checkFn?: (data: unknown) => boolean;
    transformData?: (data: unknown) => unknown;
    errorHandler?: (error: AxiosError) => void;
    showDetail?: boolean;
  }
}

export default class Request {
  service: AxiosInstance;

  constructor(options: AxiosRequestConfig = {}) {
    const { baseURL, baseUrl, timeout, message, ...rest } = options;
    this.service = axios.create({
      baseURL: baseURL || baseUrl || '',
      timeout: timeout || 100000,
      message: message || noop,
      ...rest
    });
    this.temp = this.temp.bind(this);
    this.generate = this.generate.bind(this);
    requestInterceptor(this.service);
    responseInterceptor(this.service);
  }

  static getCookieData(): typeof COOKIE_DATA {
    return getCookieDataUtil();
  }

  get getCookieData(): typeof Request.getCookieData {
    console.log(
      'getCookieData has been deprecated and will be removed in next, please use js-cookie instead'
    );
    return this.getCookieData;
  }

  // 清除请求
  static clear(whiteList: string[] = []): void {
    clearPendingRequest(whiteList);
  }

  clear(): typeof Request.clear {
    console.log('clear has been deprecated and will be removed in next');
    return this.clear;
  }

  generate(data: AxiosRequestConfig): AxiosPromise<unknown> {
    return this.service(data).catch((err) => {
      // 接口请求中发生未知错误
      const { config } = err;
      const { errorDetail, warning } = config;
      if (warning && errorDetail && errorDetail.message) {
        try {
          console.log(`接口报错`);
        } catch (error) {
          console.log(`接口报错`, error);
        }

        showErrMessage(config.message, err);
      }
      return Promise.reject(err);
    });
  }

  temp(url: string, config: AxiosRequestConfig = {}) {
    return (data: unknown, customer: AxiosRequestConfig): AxiosPromise<unknown> => {
      const options: AxiosRequestConfig = { ...config, ...customer };
      const { method } = options;
      return this.generate({
        url,
        method,
        [method === 'post' ? 'data' : 'params']: data,
        ...options
      });
    };
  }
}
