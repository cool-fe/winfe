import axios from 'axios';
import type { AxiosInstance } from 'axios';

import { pendingRequest, handleError } from '../util';

// 响应拦截
const responseInterceptor = (service: AxiosInstance): void => {
  service.interceptors.response.use(
    (res) => {
      const { config } = res;
      //@ts-ignore
      pendingRequest.delete(config.storeUrl || '');
      return res.data;
    },
    (err) => {
      // 判断请求是否被取消
      if (axios.isCancel(err)) {
        // eslint-disable-next-line no-param-reassign
        err = err.message;
      }
      const { config } = err;
      // 删除pendingRequest 中的存储
      if (config && pendingRequest.has(config.storeUrl)) {
        pendingRequest.delete(config.storeUrl);
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
