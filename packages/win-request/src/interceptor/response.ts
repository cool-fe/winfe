import axios from 'axios';
import type { AxiosInstance } from 'axios';

import { pendingRequest, handleError, showSuccessMessage } from '../util';

const responseInterceptor = (service: AxiosInstance): void => {
  service.interceptors.response.use(
    (res) => {
      const { config } = res;
      const { successTxt, warning, message, url } = config;
      if (res.success && successTxt && message) {
        // 接口成功且配置了成功文案
        showSuccessMessage(message, config);
        return res;
      } else {
        // 接口失败且允许自动报错
        if (warning) {
          res.errorDetail.id = res.traceid;
          res.errorDetail.path = url;
        }
        return Promise.reject(res);
      }
    },
    (err) => {
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
      if (config && pendingRequest.has(config.url)) {
        pendingRequest.delete(config.url);
      }
      handleError(err);
      return Promise.reject({
        success: false,
        errorDetail: {
          path: config ? config.url : err.url || '',
          detailMsg: err.stack,
          message: err.message
        }
      });
    }
  );
};

export default responseInterceptor;
