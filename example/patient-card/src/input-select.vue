<template>
  <div class="el-input-group el-input-group--append">
    <el-select
      ref="chooseSelect"
      v-model="currentValue"
      filterable
      clearable
      :filter-method="dataFilter"
      :popper-append-to-body="false"
      popper-class="patient-select"
      :loading="loading"
      @change="changePersonInfo"
      @clear="handleSelectClear"
      v-bind="$attrs"
      v-on="$listeners">
      <!-- header column -->
      <el-option value="item" :disabled="true" v-if="tableColumnList && filterOptions.length">
        <div
          class="table-td el-select-dropdown__header header-sticky"
          v-for="(column, index) in tableColumnList"
          :key="index">
          <div class="select-cell" v-if="column.displayFlag === primaryKey">
            {{column.columnChineseName}}
          </div>
        </div>
      </el-option>
      <!-- body list -->
      <el-option
        ref="elOption"
        v-for="item in filterOptions"
        :key="item.id"
        :label="item.list[labelIndex] && item.list[labelIndex].dataValue"
        :value="item.id">
        <div
          class="table-td"
          v-for="(c, index) in item.list"
          :key="index">
          <div class="select-cell" :class="{'select-cell-disabled': item.fileDisabled}" v-if="c.displayFlag === primaryKey">
            {{c.dataValue}}
          </div>
        </div>
      </el-option>
    </el-select>
  </div>
</template>
<script>
import _ from 'lodash'
import Request from 'his-request'

const { user } = Request.getCookieData()

export default {
  name: 'InputSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    value (newValue) {
      this.currentValue = newValue
    },
    options (newVal) {
      let options = []
      this.filterOptions = newVal
      if (newVal.length) {
        // hover default first option
        setTimeout(() => {
          options = this.$refs.elOption || []
          if (options.length) {
            options[0].hoverItem()
          }
        })
      }
    },
    tableColumnList (newVal) {
      if (newVal && newVal.length) {
        // get select label index
        for (let i = 0; i < newVal.length; i++) {
          if (newVal[i].inputDisplayFlag === this.primaryKey) {
            this.labelIndex = i
            return
          }
        }
      }
    }
  },
  data () {
    return {
      currentValue: '',
      loading: false,
      user,
      primaryKey: '98175',
      filterOptions: [],
      labelIndex: -1
    }
  },
  props: {
    value: {
      type: String
    },
    options: {
      type: Array,
      default: () => []
    },
    cardType: Object,
    generalIndexServiceCode: String,
    indexSearchKeyword: String,
    tableColumnList: Array,
    loadDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    changePersonInfo (id = '') {
      setTimeout(() => {
        this.$refs.chooseSelect.blur()
      })
      this.$emit('change', id)
      if (id) {
        const selectItem = this.filterOptions.find(item => item.id === id)
        if (selectItem && selectItem.fileDisabled && !this.loadDisabled) {
          this.$messageEx.warning('患者档案已停用，请联系管理员')
        } else {
          const { indexSearchMethodId, isReadCard } = this.cardType
          const params = {
            bizIdList: [id],
            indexSearchKeyword: this.indexSearchKeyword,
            indexSearchMethodId,
            selectedData: [selectItem.list],
            isReadCard: !!isReadCard,
            cardInfo: this.cardType,
            disabled: selectItem.fileDisabled // 该项是否禁用
          }
          this.$emit('personInfo', params)
        }
      }
    },
    handleSelectClear () {
      this.$emit('personInfo', {
        bizIdList: null,
        cardInfo: this.cardType,
        selectedData: null
      })
    },
    handleFocus () {
      setTimeout(() => {
        this.$refs.chooseSelect.focus()
      }, 100)
    },
    // 自定义过滤
    dataFilter (keyword) {
      if (this.options.length) {
        const attrIndex = this.getSearchAttr(this.options[0].list)
        this.filterOptions = this.options.filter((option) => {
          let dataValue = _.get(option.list[attrIndex], 'dataValue', '')
          // lodash只有返回undefined默认值才有效
          if (dataValue === null) {
            dataValue = ''
          }
          return dataValue.includes(keyword)
        })
      }
    },
    // 查找被搜索的属性：取首个displayFlag为98175的index
    getSearchAttr (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].displayFlag === this.primaryKey) {
          return i
        }
      }
    }
  }
}
</script>
