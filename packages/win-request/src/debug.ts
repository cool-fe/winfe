/*
 * @Author: jun.fu<fujunchn@qq.com>
 * @LastEditors: jun.fu<fujunchn@qq.com>
 * @Description: file content
 * @Date: 2021-06-01 15:39:51
 * @LastEditTime: 2021-08-05 10:16:18
 * @FilePath: /winfe/packages/win-request/src/debug.ts
 */

let isDebugger = false
/**
 * 获取随机id
 * @returns
 */
function createRandomId (): string {
  return `${(Math.random() * 10000000)
    .toString(16)
    .substr(0, 4)}_${new Date().getTime()}_${Math.random()
    .toString()
    .substr(2, 5)}`
}

interface DebugEvent {
  detail?: {
    isDebugger: boolean
  }
}

function changeDebuggerEnable (e: Event & DebugEvent): void {
  if (e.detail != null) {
    isDebugger = e.detail.isDebugger
  }
}

function init():void{
    window.document.removeEventListener('debugger', changeDebuggerEnable)
    window.document.addEventListener('debugger', changeDebuggerEnable)
}

init()

function debugBack(res:unknown,data:unknown):void {
  // debug 模式
  if (isDebugger) {
    window.document.dispatchEvent(new CustomEvent('back', {
      detail: {
        res: res,
        data
     }
    }))
  }
}

/**
 * 注册debug，并等待事件回调
 * @param data
 * @returns
 */
export default async function <T>(
  data: T & { debugId?: string }
): Promise<T & { debugId?: string }> {
  if (isDebugger) {
    // 添加唯一值
    data.debugId = createRandomId()
    window.document.dispatchEvent(
      new CustomEvent('request', {
        detail: data
      })
    )
  }
  return new Promise(resolve => {
    if (isDebugger && data.debugId != null) {
      window.document.addEventListener(data.debugId, () => {
        resolve(data)
      })
    } else {
      resolve(data)
    }
  })
}

export { isDebugger,debugBack }
