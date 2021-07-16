/* eslint-disable no-undef */

import cookieData from './cookieData'

/**
 * @param {Object} desc - 包含属性 {id: 事件id, name: 混合框架需要执行的方法名称}
 * @param {string} desc.id 事件ID
 * @param {string} desc.name 业务dll需要的function名称
 * @param {Object} params - 事件的入参body
 * @param {Function} cb - 给混合框架事件回调函数 入参为混合框架的出参，cb(res, error)
 */
export function dispatchEvent (desc, params, reject, cb) {
  const _this = this
  const { id, name } = desc
  const dllParams = {
    header: cookieData,
    body: [
      { funcname: name },
      params,
      { token: cookieData.Authorization },
      {
        header: cookieData
      }
    ]
  }
  // eslint-disable-next-line no-console
  console.log(dllParams, desc, 'test...')
  // 避免阻塞页面渲染
  setTimeout(() => {
    try {
      _this.winning.dispatchEvent(id, JSON.stringify(dllParams), (res) => {
        const resData = JSON.parse(res)
        if (resData.bizCode === id) {
          // eslint-disable-next-line no-console
          console.log(resData, id)
          if (resData.success) {
            cb && cb(resData)
          } else {
            cb && cb(null, resData.errorDetail || resData)
          }
        } else {
          // eslint-disable-next-line no-console
          console.log(resData, 'not-bizCode')
        }
      })
    } catch (error) {
      reject(error)
    }
  }, 0)
}

export default {
  dispatchEvent
}
