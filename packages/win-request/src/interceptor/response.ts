import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

import type { ResponseData } from '../request';

import { pendingRequest, handleError, showSuccessMessage } from '../util';

const responseInterceptor = (service: AxiosInstance): void => {
  service.interceptors.response.use(
    (res: AxiosResponse<ResponseData>) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      const { config, data } = res;
      const { successTxt, warning, message, url } = config;
      if (data && data.success) {
        if (message && successTxt) {
          // 接口成功且配置了成功文案
          showSuccessMessage(message, config);
        }
        return typeof config.dataField === 'string' ? res[config.dataField] : res;
      } else {
        // 接口失败且允许自动报错
        if (warning) {
          data.errorDetail.id = (data || {}).traceid;
          data.errorDetail.path = url;
        }
        return Promise.reject(res);
      }
    },
    (err: AxiosError<ResponseData>) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      // 判断请求是否被取消
      if (axios.isCancel(err)) {
        try {
          // eslint-disable-next-line no-param-reassign
          err = JSON.parse(err.message);
          // eslint-disable-next-line no-empty
        } catch (error) {}
      }
      const { config } = err;
      // 删除pendingRequest 中的存储
      if (config && pendingRequest.has(config.url || '')) {
        pendingRequest.delete(config.url || '');
      }
      handleError(err);
      return Promise.reject({
        ...err,
        data: {
          success: false,
          errorDetail: {
            path: config ? config.url : err.url || '',
            detailMsg: err.stack,
            message: err.message
          }
        }
      });
    }
  );
};

export default responseInterceptor;
