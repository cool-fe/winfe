<template>
  <div style="display:inline-block;position:relative">
    <el-form-item
      :labelWidth="labelWidth"
      :label="label"
      v-bind="$attrs"
      v-if="isInForm"
    >
      <el-select
        ref="elSelect"
        :disabled="readOnly"
        v-bind="selectAttrs"
        v-loading="isLoading"
        :popper-append-to-body="false"
        :popper-class="popperClass"
        v-model="check"
        multiple
      >
        <el-option
          v-for="item in list"
          :key="item.personalTagId"
          :value="item.personalTagId"
          :label="item.tagName"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <template v-else>
      <el-select
        ref="elSelect"
        :disabled="readOnly"
        v-loading="isLoading"
        v-bind="$attrs"
        v-model="check"
        :popper-class="popperClass"
        :popper-append-to-body="false"
        multiple
      >
        <el-option
          v-for="item in list"
          :key="item.personalTagId"
          :value="item.personalTagId"
          :label="item.tagName"
        >
        </el-option>
      </el-select>
    </template>
  </div>
</template>

<script>
import { apiQueryPatientTags, apiSavePatientTags } from './api/api'

export default {
  name: 'patient-tags',
  props: {
    labelWidth: {
      type: String
    },
    label: {
      type: String,
      default: '患者标记'
    },
    bizRoleId: {
      type: String
    },
    inputParams: {
      type: Object
    },
    outputParams: {
      type: Object
    },
    personId: {
      type: String
    },
    successText: {
      type: String,
      default: '保存成功'
    },
    tagCategoryIds: {
      type: Array,
      default: () => ['399215228']
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    forceShowAll: { // 显示所有项，因为接口根据readOnly有关，这里为避免对现有逻辑影响，追加强制显示所有项的字段
      type: Boolean,
      default: false
    },
    ignoreSaveTip: {
      type: Boolean,
      default: false
    },
    selectAttrs: {
      type: Object
    }
  },
  data () {
    return {
      isLoading: false,
      popperClass: 'patient-tag-popper',
      list: [],
      isTriggerChange: true, // bizRoleId改变是否需要出发init方法
      check: [],
      saveCheck: [] // 记录初始化时的选中数据，为了判断该是否已发生变化
    }
  },
  watch: {
    bizRoleId: {
      immediate: true,
      handler () {
        if (!this.isTriggerChange) {
          return
        }
        this.init()
      }
    },
    check () {
      this.$emit('input', this.check)
    }
  },
  mounted () {
    this.$nextTick(() => {
      const select = this.$refs.elSelect
      console.log(select, 'select')
      if (select && select.$el) {
        select.$el.onkeydown = ev => {
          const event = ev || window.event
          // Enter键
          if (event.keyCode === 13) {
            console.log('el select')
          }
        }
      }
    })
  },
  methods: {
    /** notModifyCheck为true时，表示不需要check */
    init (notModifyCheck = false) {
      const readOnly = this.readOnly && !this.forceShowAll
      return apiQueryPatientTags({
        appSystemCode: '256495',
        bizRoleId: this.bizRoleId,
        personId: this.personId,
        readOnly: readOnly,
        tagCategoryIds: this.tagCategoryIds,
        ...this.inputParams
      })
        .then(res => {
          if (res.success) {
            this.list = res.data
            if (!notModifyCheck) {
              this.check = res.data
                .filter(item => (readOnly ? true : item.isSelected === 0))
                .map(item => item.personalTagId)
              this.saveCheck = [...this.check]
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    validate () {
      return this.check.length > 0
    },
    /** 暴露于外部，延迟保存功能 */
    delaySave (bizRoleId) {
      if (!bizRoleId && this.bizRoleId === bizRoleId) {
        // 如果不传bizRoleId或者bizRoleId无变化，则直接走save
        this.save()
      } else {
        // 新保存功能
        console.log('delaySave patientTags...')
        this.isTriggerChange = false
        this.save(bizRoleId)
        this.isTriggerChange = true
        //
        // this.init(true).then(() => {
        //   this.isTriggerChange = true
        //   this.save(bizRoleId)
        // }).catch(() => {
        //   this.isTriggerChange = true
        // })
      }
    },
    save (bizRoleId) {
      if (this.readOnly) return
      const params = {
        bizRoleId: bizRoleId || this.bizRoleId,
        personId: this.personId,
        personalTagIds: this._getSelected(),
        ...this.outputParams
      }
      this.isLoading = true
      this.$emit('update:loading', this.isLoading)
      return apiSavePatientTags(params)
        .then(res => {
          if (res.success) {
            !this.ignoreSaveTip &&
              this.$messageEx({ message: this.successText, type: 'success' })
          }
          return res
        })
        .finally(() => {
          this.isLoading = false
          this.$emit('update:loading', this.isLoading)
        })
    },
    _getSelected () {
      const map = {}
      this.check.forEach(item => {
        map[item] = true
      })
      return this.list.map(item => {
        return {
          isSelected: map[item.personalTagId] ? 0 : 1, // 0：选中
          personalTagId: item.personalTagId
        }
      })
    },
    /** 判断患者标签是否发生变化 */
    compareIfChanged () {
      const check = this.check
      const saveCheck = this.saveCheck
      const sameFlag =
        check.length === saveCheck.length &&
        check.every(a => saveCheck.some(b => a === b)) &&
        saveCheck.every(_b => check.some(_a => _a === _b))
      return sameFlag
    },
    /** 显示选中的中文值 */
    getDisplayValue () {
      const displayValue = []
      this.check.forEach(tagId => {
        const checkItem = this.list.find(item => item.personalTagId === tagId)
        checkItem && displayValue.push(checkItem.tagName)
      })
      return displayValue.join('、')
    },
    /** 设置默认值 */
    setDefault () {
      if (!this.check || !this.check.length) {
        // 未选中值，设置第一条为默认值
        this.check = this.list.slice(0, 1).map(item => item.personalTagId)
      }
    },
    clear () {
      this.check = []
    },
    blur () {
      this.$refs.elSelect.blur()
    }
  },
  computed: {
    isInForm () {
      let parent = this.$parent
      while (parent) {
        if (parent.$options && parent.$options.name === 'ElFormItem') {
          return false
        }
        if (parent.$options && parent.$options.name === 'ElForm') return true
        parent = parent.$parent
      }
      return false
    }
  }
}
</script>

<style></style>
