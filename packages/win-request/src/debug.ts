/*
 * @Author: jun.fu<fujunchn@qq.com>
 * @LastEditors: jun.fu<fujunchn@qq.com>
 * @Description: file content
 * @Date: 2021-06-01 15:39:51
 * @LastEditTime: 2021-08-05 10:16:18
 * @FilePath: /winfe/packages/win-request/src/debug.ts
 */

import type { AxiosRequestConfig } from 'axios';

interface DebugEvent extends Event {
  detail?: {
    isDebugger: boolean;
  };
}

// eslint-disable-next-line import/no-mutable-exports
export let isDebugger = false;

/**
 * 获取随机id
 * @returns
 */
function createRandomId(): string {
  return `${(Math.random() * 10000000)
    .toString(16)
    .substr(0, 4)}_${new Date().getTime()}_${Math.random().toString().substr(2, 5)}`;
}

function changeDebuggerEnable(e: DebugEvent): void {
  if (e.detail != null) {
    isDebugger = e.detail.isDebugger;
  }
}

function init(): void {
  window.document.removeEventListener('debugger', changeDebuggerEnable);
  window.document.addEventListener('debugger', changeDebuggerEnable);
}

init();

export function debugFallback(res: unknown, data: unknown): void {
  // debug 模式
  if (isDebugger) {
    window.document.dispatchEvent(
      new CustomEvent('back', {
        detail: {
          res,
          data
        }
      })
    );
  }
}

/**
 * 注册debug，并等待事件回调
 * @param data
 * @returns
 */
export default async function debug(data: AxiosRequestConfig): Promise<AxiosRequestConfig> {
  if (isDebugger) {
    // 添加唯一值
    data.debugId = createRandomId();
    window.document.dispatchEvent(
      new CustomEvent('request', {
        detail: data
      })
    );
    return new Promise((resolve) => {
      window.document.addEventListener(data.debugId!, () => {
        resolve(data);
      });
    });
  } else {
    // 直接调用debugHandler才会走到这里，属于不正常的操作
    return Promise.resolve(data);
  }
}
