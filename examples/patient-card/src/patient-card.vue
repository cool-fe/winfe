<template>
  <div :class="['win-patient-card',simplify?'win-patient-card--simplify':'',{'win-patient-card--vertical': vertical}]">
    <div class="win-patient-input--wrapper"
    v-win-hotkey:[{eventName:`resetNewPatient`,eventDesc:`新病人`,defaultHotKey:`ctrl+p`}].component="handlerReset">
      <win-patient-input
        ref="winPatientInputDom"
        :generalIndexServiceCode="appCode"
        @getPersonInfo="getPersonInfo"
        @modeChange="modeChange"
        :showBg="false"
        :tiled="vertical"
        :input-width="inputWidth"
      >
      </win-patient-input>
      <el-link
        v-if="reset.show && vertical"
        type="primary"
        :underline="false"
        class="win-patient-info-refresh-btn"
        @click="handlerReset"
        :style="reset.style"
      >
        <i
          class="el-icon-s-custom"
          style="font-weight: bolder"
        ></i>
        <span>新病人</span>
      </el-link>
    </div>
    <div style="padding-left: 20px">
      <win-banner ref="banner" :type-code="typeCode" :bizRoleId="bizRoleId" :hospitalSOID="hospitalSOID" :width="width" v-bind="$attrs" :use-default-width="false" @change="getUserInfo" :encounterId="encounterId"></win-banner>
    </div>
  </div>
</template>

<script>
import WinPatientInfo from './patient-info.vue'
import WinPatientInput from './patient-input.vue'

export default {
  name: 'win-patient-card',
  data () {
    return {
      userInfo: {}, // 患者基本信息
      bizRoleId: '',
      encounterId: '',
      patientInputInfo: {},
      bannerBasicDataList: {},
      bannerDynamicItemList: [],
      setValueByOut: false
    }
  },
  props: {
    vertical: {
      type: Boolean,
      default: false
    },
    appCode: {
      required: true,
      type: [String, Number]
    },
    simplify: {
      type: Boolean,
      default: false
    },
    reset: {
      type: Object,
      default: () => ({
        show: true,
        style: 'position: absolute; top:50%;transform: translateY(-50%);right: 50px;',
        fn () {}
      })
    },
    hospitalSOID: {
      type: String,
      default: '256181'
    },
    width: {
      type: [String, Number],
      default: 'auto'
    },
    newPatient: {
      type: Boolean,
      default: true
    },
    inputWidth: {
      type: Number,
      default: 250
    },
    typeCode: {
      type: [String, Number],
      default: '399303313'
    },
  },
  methods: {
    getPersonInfo (patientInputInfo) {
      const { bizIdList, selectedData } = this.patientInputInfo = patientInputInfo
      if (!bizIdList) return
      let bizRoleId = ''
      const bizRoleIdObj = selectedData[0] && selectedData[0].find(item => item.columnChineseName.indexOf('角色标识') !== -1)
      const encounterIdObj = selectedData[0] && selectedData[0].find(item => item.columnChineseName.indexOf('就诊标识') !== -1)
      // 有角色标识使用角色标识， 没有的使用bizId
      if (bizRoleIdObj) {
        bizRoleId = bizRoleIdObj.dataValue
      } else {
        bizRoleId = bizIdList[0]
      }
      // 就诊标识
      if (encounterIdObj) {
        this.encounterId = encounterIdObj.dataValue
      }
      if (!bizRoleId) {
        console.error('没有bizRoleId', 'patient-card')
        return
      }
      // bizRoleId相同，直接emit缓存的患者信息
      if (this.bizRoleId === bizRoleId) {
        this.emitUserInfo()
      }
      this.bizRoleId = bizRoleId
      if (!bizIdList || bizIdList.length === 0) {
        this.handlerReset()
      }
    },
    modeChange (val) {
      this.$emit('modeChange', val)
    },
    handlerReset () {
      this.clear()
      if (this.reset && typeof this.reset.fn === 'function') {
        this.reset.fn()
      }
    },
    clear () {
      this.bizRoleId = ''
      this.userInfo = {}
      this.$refs.banner.clearData()
      this.$refs.winPatientInputDom.clear()
      this.$refs.winPatientInputDom.shouldFocus()
    },
    getUserInfo (bannerInfo) {
      if (!bannerInfo) return
      const { bannerBasicDataList, bannerDynamicItemList } = bannerInfo
      this.bannerBasicDataList = bannerBasicDataList // bannner基础信息
      this.bannerDynamicItemList = bannerDynamicItemList // 右半部配置信息
      this.emitUserInfo()
    },
    emitUserInfo () {
      // 外部设置的 不触发了
      if (this.setValueByOut) {
        this.setValueByOut = false
        return
      }
      const { bizIdList = [], indexSearchMethodId, indexSearchKeyword, selectedData = [] } = this.patientInputInfo
      const encounterInfo = selectedData[0] && selectedData[0].find(item => item.columnChineseName === '就诊标识')
      const bizRoleIdInfo = selectedData[0] && selectedData[0].find(item => item.columnChineseName === '角色标识')
      const encounterId = encounterInfo && encounterInfo.dataValue
      const bizRoleId = bizRoleIdInfo && bizRoleIdInfo.dataValue
      this.bannerBasicDataList.personalIdentityId = this.bannerBasicDataList.personId // TODO：暂时先用personId代替
      const inpatientStatusObj = this.bannerDynamicItemList.find(item => item.propertyName === 'inpatientStatus')
      this.bannerBasicDataList.inpatientStatus = inpatientStatusObj && inpatientStatusObj.propertyValue
      this.userInfo = { ...this.bannerBasicDataList, bizIdList, indexSearchMethodId, indexSearchKeyword, encounterId, bizRoleId, bannerDynamicItemList: this.bannerDynamicItemList, selectedData }
      this.$emit('change', this.userInfo)
    },
    setBizRoleId (bizRoleId, flag = true) {
      this.bizRoleId = bizRoleId
      this.setValueByOut = flag
    },
    setEncounterId (encounterId, flag = true) {
      this.encounterId = encounterId
      this.setValueByOut = flag
    },
    refresh () {
      this.$refs.banner.updateData()
    }
  },
  components: {
    [WinPatientInfo.name]: WinPatientInfo,
    [WinPatientInput.name]: WinPatientInput
  }
}
</script>
