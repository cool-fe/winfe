import Request from 'his-request'
import { readcard } from 'winning-dll'
import * as commonMix from './commonMix'

const { user } = Request.getCookieData()

export default {
  data () {
    return {
      userInfo: user
    }
  },
  methods: {
    async execHybridReadCard (cardInfo, identityNo = '', cb) {
      const identitySearchSettings = [commonMix.default.methods.computedIdentitySearchTypeCode(cardInfo)]
      const apiParams = {
        identityEntryId: cardInfo.indexSearchMethodId,
        identityEntryName: cardInfo.indexSearchMethodDispName || cardInfo.indexSearchMethodName,
        hospitalSOID: this.userInfo.hospitalSOID,
        identityNo: identityNo,
        applicationCode: cardInfo.applicationCode,
        identityTypeCode: identitySearchSettings,
        indexSearchMethodTypeCode: cardInfo.indexSearchMethodTypeCode, // 检索方式类型代码
        indexSearchMethodId: cardInfo.indexSearchMethodId,
        indexSearchMethodNo: identityNo,
        login: {
          employeeId: this.userInfo.employeeId,
          employeeName: this.userInfo.employeeName,
          departmentId: '',
          departmentName: '',
          ipAddress: '',
          mac: '',
          medInstiId: this.userInfo.hospitalSOID,
          medInstiName: this.userInfo.orgName
        }
      }
      try {
        const res = await readcard(apiParams)
        res.success = typeof res.success === 'string' ? res.success.toLowerCase() : res.success
        if (!res.success || res.success === 'false') {
          this.$messageEx(new Error(res.errorDetail.message))
        }
        const id = res.data.identityNo || identityNo // 混合框架出参 输入框输入 或者为空
        if (id) {
          // 读卡标志
          const flag = true
          cb(id, res.data.identityTypeCode, res.data, flag)
        } else {
          this.$messageEx(new Error('未获取有效的卡号'))
        }
      } catch (e) {
        this.$messageEx(new Error(e.message || '读卡未知错误'))
      }
    }
  }
}
