import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';

import {
  getCookieData as getCookieDataUtil,
  showErrMessage,
  clearPendingRequest,
  showSuccessMessage,
  noop
} from './util';

import type { COOKIE_DATA, MessageInstance } from './util';

import requestInterceptor from './interceptor/request';
import responseInterceptor from './interceptor/response';

interface IRequestArgvOptions {
  message: null;
  baseUrl?: string;
  baseURL?: string;
}

interface IRequestOpts {
  baseURL?: string;
  method: string;
  warning: boolean;
  cover: boolean;
  login: boolean;
  checkWarning: boolean;
  repeat: boolean;
  isAddHospitalSoid: boolean;
}

declare module 'axios' {
  export interface AxiosResponse {
    success: boolean; // if request is success
    traceid: string;
    errorDetail: {
      id: string;
      path?: string;
    };
  }
}

/**
 * @options { Object } 类Request 入参
 *
 */
export default class Request {
  service: AxiosInstance;

  message: MessageInstance;

  options: IRequestOpts | IRequestArgvOptions;

  constructor(options: IRequestArgvOptions) {
    this.service = axios.create({
      baseURL: options.baseURL || options.baseUrl || '',
      timeout: 100000
    });
    this.message = options.message || noop;
    this.options = {
      warning: true,
      cover: true,
      login: true,
      checkWarning: true,
      repeat: false,
      isAddHospitalSoid: true,
      ...options
    };
    this.temp = this.temp.bind(this);
    this.generate = this.generate.bind(this);
    requestInterceptor(this.service);
    responseInterceptor(this.service);
  }

  static getCookieData(): typeof COOKIE_DATA {
    return getCookieDataUtil();
  }

  get getCookieData(): typeof Request.getCookieData {
    console.log('deprate');
    return this.getCookieData;
  }

  // 清除请求
  static clear(whiteList: string[] = []): string[] | undefined {
    return clearPendingRequest(whiteList);
  }

  get clear(): typeof Request.clear {
    console.log('deprate');
    return this.clear;
  }

  static async asyncClear(whiteList: string[] = []): Promise<void> {
    clearPendingRequest(whiteList);
  }

  get asyncClear(): typeof Request.asyncClear {
    console.log('deprate');
    return this.asyncClear;
  }

  generate(data: AxiosRequestConfig, options: any): AxiosPromise<any> {
    return this.service(data)
      .then((res) => {
        const { successTxt, warning } = options;
        if (res.success && successTxt) {
          // 接口成功且配置了成功文案
          showSuccessMessage(this.message, options);
          return res;
        } else {
          // 接口失败且允许自动报错
          if (warning) {
            res.errorDetail.id = res.traceid;
            res.errorDetail.path = data.url;
          }
          return Promise.reject(res);
        }
      })
      .catch((err) => {
        // 接口请求中发生未知错误
        const { errorDetail } = err;
        if (options.warning && errorDetail && errorDetail.message) {
          try {
            console.log(`接口报错`);
          } catch (error) {
            console.log(`接口报错`, error);
          }

          showErrMessage(this.message, errorDetail, options);
        }
        return Promise.reject(err);
      });
  }

  temp(url: string, config: AxiosRequestConfig = {}) {
    return (data: any, customer: any) => {
      const options: AxiosRequestConfig = { ...this.options, ...config, ...customer };
      const { method } = options;
      return this.generate(
        {
          url,
          method,
          //@ts-ignore
          options,
          [method === 'post' ? 'data' : 'params']: data
        },
        options
      );
    };
  }
}
