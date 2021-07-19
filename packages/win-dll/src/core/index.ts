/* eslint-disable no-underscore-dangle */
import { Message } from 'element-ui';
import { dispatchEvent } from '../util/dll_event';

export interface DllResponse {
  success: boolean;
  errorDetail: {
    [key: string]: any;
  };
  bizCode: string;
}

// eslint-disable-next-line typescript/no-namespace
declare global {
  interface Window {
    winning: {
      getMacadress: () => string;
      getIP: () => string;
      dispatchEvent: (id: string, params: string, handle: (res: string, err?: any) => void) => void;
    };
  }
}

export interface DispatchEventFuncParamsType {
  [key: string]: unknown;
}

export type DispatchEventFuncHandleType = (res: unknown, err: unknown) => void;

const winning = window.top.winning;

export default class WinningDll {
  showError: boolean;

  constructor() {
    this.showError = true;
  }

  static checkEnvironment(): boolean {
    return !!winning;
  }

  /**
   * 获取Mac地址
   */
  static getMacAddress(): string {
    try {
      this.prototype.showError = false;
      return this.prototype.winning.getMacadress();
    } catch (error) {
      return '';
    }
  }

  /**
   * 获取IP地址
   */
  static getIpAddress(): string {
    try {
      this.prototype.showError = false;
      return this.prototype.winning.getIP();
    } catch (error) {
      return '';
    }
  }

  get winning(): typeof Window.prototype.winning {
    if (!winning) {
      if (this.showError)
        Message({
          type: 'warning',
          message: '请在WINEX环境中使用'
        });
      this.showError = true;
      throw new Error('请在WINEX环境中使用');
    }
    this.showError = true;
    return winning;
  }

  _dispatchEvent(id: string, params: DispatchEventFuncParamsType): Promise<any> {
    const dispatchEventFunc = dispatchEvent.bind(this);
    return new Promise((resolve, reject) => {
      dispatchEventFunc(id, params, reject, (res: DllResponse | null, err?: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}
