/*
 * @Author: smallalso<hu141418@gmail.com>
 * @Date: 2021-03-04 18:07:23
 * @LastEditors: smallalso<hu141418@gmail.com>
 * @LastEditTime: 2021-03-10 17:04:19
 * @FilePath: /winning-webcomponents-finance-common/src/his-dll/index.js
 */
import WinningSDK from './core/index'

export const issuingPrint = WinningSDK.issuingPrint = WinningSDK.issuingPrint.bind(WinningSDK)
export const getMacAddress = WinningSDK.getMacAddress = WinningSDK.getMacAddress.bind(WinningSDK)
export const getIpAddress = WinningSDK.getIpAddress = WinningSDK.getIpAddress.bind(WinningSDK)
export const recharge = WinningSDK.recharge = WinningSDK.recharge.bind(WinningSDK)
export const readcard = WinningSDK.readcard = WinningSDK.readcard.bind(WinningSDK)
export const refund = WinningSDK.refund = WinningSDK.refund.bind(WinningSDK)
export const refundCard = WinningSDK.refundCard = WinningSDK.refundCard.bind(WinningSDK)
export const getOutDInsuranceBudget = WinningSDK.getOutDInsuranceBudget = WinningSDK.getOutDInsuranceBudget.bind(WinningSDK)
export const getOutDInsuranceZS = WinningSDK.getOutDInsuranceZS = WinningSDK.getOutDInsuranceZS.bind(WinningSDK)
export const getRegInsuranceBudget = WinningSDK.getRegInsuranceBudget = WinningSDK.getRegInsuranceBudget.bind(WinningSDK)
export const getRegInsuranceZS = WinningSDK.getRegInsuranceZS = WinningSDK.getRegInsuranceZS.bind(WinningSDK)
export const toPay = WinningSDK.toPay = WinningSDK.toPay.bind(WinningSDK)
export const generateSettlementPic = WinningSDK.generateSettlementPic = WinningSDK.generateSettlementPic.bind(WinningSDK)
export const checkEnvironment = WinningSDK.checkEnvironment = WinningSDK.checkEnvironment.bind(WinningSDK)
export const reconciliation = WinningSDK.reconciliation = WinningSDK.reconciliation.bind(WinningSDK)


if ("object" == typeof exports && "object" == typeof module) {
  // module.exports = WinningSDK
}
if ("object" == typeof exports) {
  // exports.HISDLL = WinningSDK
}
window && (window.HISDLL = WinningSDK)

export default WinningSDK
