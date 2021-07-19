import { Message } from 'element-ui';
import cookieData from './cookieData';
import WinningDll, { DispatchEventFuncParamsType, DllResponse } from '../core';

function dealErrorMessage(data: DllResponse): void {
  const messageInfo = data.errorDetail;
  const { message, type } = messageInfo;
  if (messageInfo) {
    switch (type) {
      case 'warn':
        Message.warning(message);
        break;
      case 'tips':
        Message(message);
        break;
      case 'error':
      case 'stop':
        Message.error(message);
        break;
      default:
        break;
    }
  }
}

/**
 * @param {Object} desc - 包含属性 {id: 事件id, name: 混合框架需要执行的方法名称}
 * @param {string} desc.id 事件ID
 * @param {string} desc.name 业务dll需要的function名称
 * @param {Object} params - 事件的入参body
 * @param {Function} cb - 给混合框架事件回调函数 入参为混合框架的出参，cb(res, error)
 */
export function dispatchEvent(
  this: WinningDll,
  id: string,
  params: DispatchEventFuncParamsType,
  reject: (reason?: any) => void,
  cb: (res: DllResponse | null, err?: any) => void
): void {
  const self = this;
  const dllParams = {
    header: cookieData,
    token: cookieData.Authorization,
    body: params
  };
  // 避免阻塞页面渲染
  setTimeout(() => {
    try {
      self.winning.dispatchEvent(id, JSON.stringify(dllParams), (res: string) => {
        try {
          const resData: DllResponse = JSON.parse(res);
          if (cb && resData.bizCode === id) {
            if (resData.success) {
              cb(resData);
            } else {
              dealErrorMessage(resData);
              cb(null, resData.errorDetail || resData);
            }
          } else {
            cb(null, resData.errorDetail || resData);
          }
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  }, 0);
}

export default {
  dispatchEvent
};
