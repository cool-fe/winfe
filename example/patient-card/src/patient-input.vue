<template>
  <div class="win-remote" style="width: 100%" ref="remoteWrapper">
    <div class="win-remote__patient">
      <div
        :style="{ width: inputWidth + 'px' }"
        class="win-remote__patient--wrapper"
        :class="{'input-wrap-stretch': componentShowMethod === 'tag', 'fix-input-width': fixInputWidth}">
        <el-popover
          placement="bottom-start"
          :width="inputWidth"
          trigger="manual"
          content="数据加载中..."
          popper-class="patient-input-custom-popper-class"
          :disabled="true"
          v-model="popoverVisible">
          <el-input
            slot="reference"
            v-if="!searchType('remote')"
            v-show="isInput"
            ref="swipeInput"
            :size="size"
            v-model="inputKeyword"
            :placeholder="cardType.memo"
            v-focus
            clearable
            @keyup.native.enter.prevent="handleEnter"
            @clear="handleClear">
          </el-input>
        </el-popover>
        <input-select
          ref="inputSelect"
          v-show="!isInput || searchType('remote')"
          v-model="currentValue"
          :size="size"
          :options="options"
          :tableColumnList="tableColumnList"
          :indexSearchKeyword="inputKeyword"
          :cardType="cardType"
          :placeholder="cardType.memo"
          :remote="searchType('remote')"
          :remote-method="handleRemoteSearch"
          :no-data-text="noDataText"
          @blur="handleSelectBlur"
          @personInfo="handlePersonInfo"
          v-bind="$attrs"
          v-on="$listeners">
        </input-select>
      </div>
      <div class="win-remote__patient--list" :class="{'only-more': componentShowMethod === 'onlyMore' && !fixInputWidth }">
        <el-button
          :key="btn.indexSearchMethodId"
          v-for="(btn, index) in lineTagList"
          :type="cardType.indexSearchMethodId === btn.indexSearchMethodId ? 'primary': ''"
          class="card-type-item"
          :class="{'no-margin-right': index === lineTagList.length - 1}"
          v-win-hotkey:[{eventName:`${btn.indexSearchMethodId}`,eventDesc:`${btn.indexSearchMethodDispName||btn.indexSearchMethodName}`,defaultHotKey:handleHotKey(btn),disRegister:!handleHotKey(btn),args:btn}].component='readCardByTag'
          @click="readCardByTag(btn)">
          <span>{{btn.indexSearchMethodDispName || btn.indexSearchMethodName}}</span>
          <img class="read-card-btn-icon" :src="iconSrc(cardType, btn)"/>
        </el-button>
        <el-popover
          popper-class="win-remote__pop"
          :visible-arrow="false"
          placement="bottom-end"
          trigger="click"
          @hide="popoverHide"
          @show="popoverShow"
          v-if="cardTypeList.length !== 0"
          :disabled="!popTagList.length"
          v-model="popoverBtns">
          <el-button
            v-for="btn in popTagList"
            class="win-popover-button"
            :type="cardType.indexSearchMethodId === btn.indexSearchMethodId ? 'primary':''"
            :key="btn.indexSearchMethodId"
            v-win-hotkey:[{eventName:`${btn.indexSearchMethodId}`,eventDesc:`${btn.indexSearchMethodDispName||btn.indexSearchMethodName}`,defaultHotKey:handleHotKey(btn),disRegister:!handleHotKey(btn),args:btn}].component='readCardByTag'
            @click="readCardByTag(btn)"
            :size="size">
            <span>{{btn.indexSearchMethodDispName || btn.indexSearchMethodName}}</span>
            <img class="read-card-btn-icon" :src="iconSrc(cardType, btn)"/>
          </el-button>
          <!--button 必须为v-show, 否则初始化不能绑定事件-->
          <el-button
            type="text"
            slot="reference"
            :size="size"
            v-show="popTagList.length > 0"
            class="win-patient-input-more"
            icon="win-icon-more">
          </el-button>
        </el-popover>
      </div>
    </div>
  </div>
</template>
<script>
import { getSettingCardList } from '../api/patient'
import inputSelect from './input-select'
import hybridMixin from '../mixins/hybridFramework'
import commonMix from '../mixins/commonMix'
import iconRemote from '../../finance-theme/src/images/read-card/remote.svg'
import iconRemoteActive from '../../finance-theme/src/images/read-card/remote-active.svg'
import iconEnter from '../../finance-theme/src/images/read-card/enter.svg'
import iconEnterActive from '../../finance-theme/src/images/read-card/enter-active.svg'
import iconClick from '../../finance-theme/src/images/read-card/click.svg'
import iconClickActive from '../../finance-theme/src/images/read-card/click-active.svg'

const searchMethodType = {
  remote: '399297154',
  enter: '399297155',
  click: '399297156'
}
const fontSize = getComputedStyle(window.document.documentElement)['font-size'].substring(-2, 2)
const defaultOption = {
  btnFontSize: fontSize, // 标签字体大小
  paddingSpace: 30, // 15(padding) * 2
  marginLeft: 10,
  moreWidth: 30, // 更多按钮的宽度
  iconWidth: Math.ceil(fontSize * 1.1428) + 5,
  borderWidth: 2
}
export default {
  name: 'WinPatientInput',
  components: { inputSelect },
  data () {
    return {
      isInput: true,
      searchMethodType,
      indexServiceBaseUrl: '', // 查询接口
      inputKeyword: '',
      cardType: {},
      cardTypeList: [],
      size: 'small',
      boxWidth: 0,
      searchMethodCodeName: {
        399297154: [iconRemote, iconRemoteActive],
        399297155: [iconEnter, iconEnterActive],
        399297156: [iconClick, iconClickActive]
      },
      popoverVisible: false,
      noDataText: '数据加载中...',
      currentValue: '', // 选择框选中值
      popoverBtns: false
    }
  },
  mixins: [hybridMixin, commonMix],
  props: {
    extraParams: { // 额外的入参
      type: Object
    },
    generalIndexServiceCode: {
      type: String,
      required: true
    },
    fixInputWidth: {
      type: Boolean,
      default: true
    },
    componentShowMethod: {
      type: String,
      validator (val) {
        const flag = ['tag', 'onlyMore'].indexOf(val) !== -1
        if (!flag) {
          console.info('只能传入tag或者onlyMore')
        }
        return flag
      },
      default: 'onlyMore'
    },
    tagComputedOption: {
      type: Object,
      default () {
        return defaultOption
      }
    },
    showBg: {
      type: Boolean,
      default: true
    },
    tiled: { // 是否平铺
      type: Boolean,
      default: false
    },
    inputWidth: {
      type: Number,
      default: 200
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector('input').focus()
      }
    }
  },
  mounted () {
    // TODO: 根据宽度不同选择不同的模式
    this.boxWidth = this.$refs.remoteWrapper.clientWidth
    // 查询检索组件配置信息
    this.getIdentityList()
  },
  methods: {
    // 临时快捷键
    handleHotKey (btn) {
      const setting = btn.identitySearchSettings || []
      if (setting.length) {
        const codes = setting.map(item => item.identitySearchTypeCode)
        if (codes.includes('152690')) {
          return 'f10' // 磁卡
        } else if (codes.includes('152691')) {
          return 'f11' // 医保卡
        } else if (codes.includes('152695')) {
          return 'pageup' // 身份证
        }
      }
      return ''
    },
    handleRemoteSearch (val) {
      this.noDataText = '数据加载中...'
      // 远程搜索
      this.getRemoteInfo(val, this.computedIdentitySearchTypeCode(this.cardType))
    },
    // 下拉框失去焦点
    handleSelectBlur () {
      // 如果立即切换成input，则select的change事件不能及时执行
      setTimeout(() => {
        if (this.searchType('enter') || this.searchType('click')) {
          this.isInput = true
        } else if (this.searchType('remote')) {
          // element bug:当焦点切换到浏览器地址栏，el-select输入框并没有清空。手动调用下
          this.$refs.inputSelect && this.$refs.inputSelect.$children[0].$children[0].blur()
        }
        // 失焦后远程搜索数据清空
        this.options = []
      }, 300)
    },
    // 通过检索类型查询检索组件配置信息
    getIdentityList () {
      getSettingCardList({
        generalIndexServiceCode: this.generalIndexServiceCode
      }).then((res) => {
        if (res.success) {
          // 全部tag铺满的长度
          const data = res.data || {}
          this.indexSearchMethods = data.indexSearchMethods
          this.cardTypeList = data.indexSearchMethods || []
          this.indexServiceBaseUrl = data.indexServiceBaseUrl
          if (!this.indexServiceBaseUrl) this.$message.error('请配置读卡组件请求接口')
          // 默认第一个选中
          this.cardType = this.cardTypeList.filter(cardType => {
            return cardType.defaultFlag === '98175'
          })[0] || {}
          // 远程搜索input非自定义
          if (this.searchType('remote')) {
            setTimeout(() => {
              this.$refs.inputSelect && this.$refs.inputSelect.handleFocus()
            }, 300)
          }
          if (this.componentShowMethod === 'tag' && !this.tiled) {
            this.tagComputed(this.cardTypeList)
          }
          this.getRemoteApi()
        }
      })
    },
    readCardByTag (curBtn) {
      // 切换搜索模式
      const { interfaceOriginFlag } = curBtn
      this.cardType = curBtn
      if (this.searchType('remote')) {
        this.$refs.inputSelect.handleFocus()
        this.options = []
      } else {
        // fix: 读卡也接收输入方式
        setTimeout(() => {
          this.shouldFocus()
        })
      }
      // 索引检索方式为点击触发不清空输入
      if (!this.searchType('click')) {
        this.clear()
      }
      if (this.componentShowMethod === 'tag' && !this.tiled) {
        this.tagComputed(this.cardTypeList)
      }
      if (interfaceOriginFlag === this.primaryKey && this.searchType('click')) {
        // 当混合框架接口慢则会被阻塞，导致按钮切换反应迟钝。采用宿主环境重新调用宏任务请求吧
        setTimeout(() => {
          this.requestHybridInterface()
        }, 100)
      }
      if (this.popoverBtns) {
        this.popoverBtns = false
      }
    },
    // input输入框enter事件
    handleEnter () {
      const { interfaceOriginFlag, indexSearchMethodTypeCode } = this.cardType
      // interfaceOriginFlag：是否从接口读取
      if (interfaceOriginFlag === this.primaryKey && searchMethodType.enter === indexSearchMethodTypeCode) {
        this.requestHybridInterface()
      } else {
        // 身份标识检索 && 院内发行就诊卡
        const isReadCard = this.cardType.identitySearchFlag === this.primaryKey && this.cardType.identitySearchSettings[0].identitySearchTypeCode === '152690'
        this.getRemoteInfo(this.inputKeyword, this.computedIdentitySearchTypeCode(this.cardType), null, isReadCard)
      }
    },
    // 走混合框架读卡
    requestHybridInterface () {
      this.execHybridReadCard(this.cardType, this.inputKeyword, this.getRemoteInfo)
    },
    handlePersonInfo (data) {
      this.isInput = true
      this.options = []
      // 包含卡介质标识
      data.cardInfo = this.cardType
      this.$emit('getPersonInfo', data)
    },
    // 清空所有输入框或者下拉列表
    clear () {
      // 输入框状态
      this.inputKeyword = ''
      this.isInput = true
      // 选择框状态
      this.currentValue = ''
      this.options = []
    },
    // 清空
    handleClear () {
      this.$emit('getPersonInfo', {
        bizIdList: null,
        cardInfo: this.cardType,
        selectedData: null
      })
    },
    tagComputed (cardTypeList = []) {
      if (!Array.isArray(cardTypeList)) return
      let allBtnWidth = 0
      let btnTiledNum = 0
      const { btnFontSize, paddingSpace, moreWidth, iconWidth, marginLeft, borderWidth } = this.tagComputedOption
      for (var i = 0; i < cardTypeList.length; i++) {
        const name = cardTypeList[i].indexSearchMethodDispName || cardTypeList[i].indexSearchMethodName || ''
        allBtnWidth += (name.length * btnFontSize) + iconWidth + paddingSpace + marginLeft + borderWidth
        if (this.boxWidth >= this.inputWidth + allBtnWidth + moreWidth) {
          btnTiledNum = i + 1
        } else {
          break // 当外部容器宽度小于所有元素宽度
        }
      }
      // 输入框长度
      this.tagNum = btnTiledNum
    },
    iconSrc (cardItem, tagItem) {
      const icon = this.searchMethodCodeName[tagItem.indexSearchMethodTypeCode]
      return (cardItem.indexSearchMethodId === tagItem.indexSearchMethodId) ? icon[1] : icon[0]
    },
    shouldFocus () {
      const swipeInput = this.$refs.swipeInput
      if (swipeInput) {
        this.$refs.swipeInput.$el.querySelector('input').focus()
      } else {
        // 远程搜索
        this.$refs.inputSelect.handleFocus()
      }
    },
    // 请求配置接口
    async getRemoteInfo (indexSearchKeyword, identitySearchTypeCode, cardData, isReadCard = false) {
      // this.popoverVisible = true
      this.RemoteMethod(indexSearchKeyword, identitySearchTypeCode, isReadCard, () => {
        // search again: clear select value, or can't emit change event.
        this.currentValue = ''
        if (this.options.length === 1) {
          // enter/click方式且检索结果唯一则自动返回
          if (this.searchType('enter') || this.searchType('click')) {
            // this.isInput = true
            setTimeout(() => {
              const refs = this.$refs.inputSelect
              // 索引0行header为disabled
              refs && refs.$el.querySelectorAll('.el-select-dropdown__item')[1].click()
            })
            this.cardType.isReadCard = isReadCard
          }
        } else if (this.options.length > 1) {
          this.isInput = false
          this.$nextTick(() => {
            this.$refs.inputSelect.handleFocus()
          })
        } else {
          // 读卡或返回空
          const params = {
            bizIdList: null,
            cardData,
            indexSearchKeyword,
            identitySearchTypeCode,
            isReadCard: isReadCard, // 是否是通过读卡
            cardInfo: this.cardType
          }
          this.$emit('getPersonInfo', params)
        }
        // this.popoverVisible = false
      })
    },
    popoverHide () {
      this.$emit('popoverStatus', false)
    },
    popoverShow () {
      this.$emit('popoverStatus', true)
    },
    // 查询：是否是某种检索方式
    searchType (type) {
      return this.cardType.indexSearchMethodTypeCode === searchMethodType[type]
    }
  },
  computed: {
    // 行标签
    lineTagList () {
      const method = this.componentShowMethod
      // 平铺：按钮全部铺开展示
      if (this.tiled) {
        return [...this.cardTypeList]
      }
      if (method === 'onlyMore') {
        return this.cardTypeList.slice(0, 1)
      }
      if (method === 'tag') {
        return this.cardTypeList.slice(0, this.tagNum)
      }
      return []
    },
    // pop中的标签
    popTagList () {
      const method = this.componentShowMethod
      if (this.tiled) {
        return []
      }
      if (method === 'onlyMore') {
        return this.cardTypeList.slice(1)
      }
      if (method === 'tag') {
        return this.cardTypeList.slice(this.tagNum)
      }
      return []
    }
  }
}
</script>
