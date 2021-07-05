<template>
  <div :class="['win-patient-info',simplify?'win-patient-info--simplify':'']">
    <!-- 姓名等基本信息 -->
    <div class="win-patient-info__left">
      <win-patient-avatar
        :width="simplify ? 34:80"
        :url="userInfo.portraitUrl"
        :gender="userInfo.genderCode"
        :isBorder="false"
        class="win-patient-info__left--avatar"
        :class="{simplify}"
      >
      </win-patient-avatar>
      <div class="win-patient-info__left--info">
        <template v-if="!simplify">
          <div class="win-patient-info__left--info--top">
            <div
              class="win-patient-info__left--info--top--name-age-sex"
              :class="{skeleton:loading,active}"
              :style="{width: inforTags.length&&!loading?'340px':'100%'}"
            >
              <template v-if="!loading">
                <span>{{userInfo.fullName}}</span>
                <span>{{userInfo.genderCode==='50602'?'男':userInfo.genderCode==='50603'?'女':'未知'}}</span>
                <span>{{userInfo.ageDisplay}}</span>
              </template>
            </div>
            <div
              v-if="loading"
              style="display: flex;"
            >
              <div
                class="win-patient-info__left--info--top--tag1 skeleton"
                :class="{active}"
              ></div>
              <div
                class="win-patient-info__left--info--top--tag2 skeleton"
                :class="{active}"
              ></div>
              <div
                class="win-patient-info__left--info--top--tag3 skeleton"
                :class="{active}"
              ></div>
              <div
                class="win-patient-info__left--info--top--tag3 skeleton"
                :class="{active}"
              ></div>
              <div
                class="win-patient-info__left--info--top--tag3 skeleton"
                :class="{active}"
              ></div>
            </div>
            <div
              v-if="!loading&&inforTags.length"
              style="display: flex;max-width: 248px; overflow: hidden;"
            >
              <el-tag
                v-for="(tag,index) in inforTags"
                size="mini"
                disable-transitions
                :key="index"
                :type="tag.type"
              >
                {{tag.name}}</el-tag>
            </div>
          </div>
          <div class="win-patient-info__left--info--bottom">
            <div
              class="win-patient-info__left--info--bottom--icon-phone"
              :class="{skeleton:loading,active}"
            >
              <i
                v-if="!loading"
                class="win-icon-outpatient-phone"
              ></i>
            </div>
            <div
              class="win-patient-info__left--info--bottom--phone-number"
              :class="{skeleton:loading,active}"
            >
              <span v-if="!loading">{{userInfo.phone?userInfo.phone:'未知'}}</span>
            </div>
            <div
              class="win-patient-info__left--info--bottom--icon-location"
              :class="{skeleton:loading,active}"
            >
              <i
                v-if="!loading"
                class="win-icon-outpatient-location"
              ></i>
            </div>
            <div
              :title="userInfo.location"
              class="win-patient-info__left--info--bottom--location"
              :class="{skeleton:loading,active}"
            >
              <span v-if="!loading">{{userInfo.location?userInfo.location:'未知'}}</span>
            </div>
          </div>
        </template>
        <!-- 精简模式 开始-->
        <template v-else>
          <div class="win-patient-info__left--info--top">
            <div
              class="win-patient-info__left--info--top--name-age-sex"
              :class="{skeleton:loading,active,simplify}"
              :style="{width: inforTags.length&&!loading?'340px':'100%'}"
            >
              <template v-if="!loading">
                <span>{{userInfo.fullName}}</span>
                <span>{{userInfo.genderCode==='50602'?'男':userInfo.genderCode==='50603'?'女':'未知'}}</span>
                <span>{{userInfo.ageDisplay}}</span>
              </template>
              <span
                v-else
                :class="['name-sex-skeleton','skeleton',active?'active':'']"
              ></span>
              <i class="win-icon-outpatient-outpatientNo"></i>
              <span :class="['outpatientNoValue',loading?'outpatientNoValue-loading':'','skeleton',active && loading?'active':'']">{{loading?'':userInfo.omrn}}</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="`电话：${userInfo.phone?userInfo.phone:'未知'}`"
                placement="bottom-start"
              >
                <i class="win-icon-outpatient-phone"></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="`地址：${userInfo.location?userInfo.location:'未知'}`"
                placement="bottom-start"
              >
                <i class="win-icon-outpatient-location"></i>
              </el-tooltip>
            </div>
          </div>
        </template>
        <!-- 精简模式 结束-->
      </div>
    </div>
    <!-- 分割线 -->
    <div
      v-if="outpatientInfo && !simplify"
      class="win-patient-info__split"
    ></div>
    <!-- 门诊信息 -->
    <div
      v-if="outpatientInfo && !simplify"
      class="win-patient-info__right"
    >
      <div class="win-patient-info__right--rows">
        <div
          class="win-patient-info__right--rows--item"
          :class="{skeleton:loading,active}"
        >
          <template v-if="!loading">
            <span class="outpatien-lable">门诊号：</span>
            <span class="outpatien-value">M342370098A</span>
          </template>
        </div>
        <div
          class="win-patient-info__right--rows--item"
          :class="{skeleton:loading,active}"
        >
          <template v-if="!loading">
            <span class="outpatien-lable">挂号科目：</span>
            <span class="outpatien-value">内分泌科高级知名专家号</span>
          </template>
        </div>
        <div
          class="win-patient-info__right--rows--item"
          :class="{skeleton:loading,active}"
        >
          <template v-if="!loading">
            <span class="outpatien-lable">保险信息：</span>
            <span class="outpatien-value">门诊全费病人</span>
          </template>
        </div>
      </div>
      <div class="win-patient-info__right--rows">
        <div
          class="win-patient-info__right--rows--item"
          :class="{skeleton:loading,active}"
        >
          <template v-if="!loading">
            <span class="outpatien-lable">就诊号序：</span>
            <span class="outpatien-value">M342370098A</span>
          </template>
        </div>
        <div
          class="win-patient-info__right--rows--item"
          :class="{skeleton:loading,active}"
        >
          <template v-if="!loading">
            <span class="outpatien-lable">账户余额：</span>
            <span class="outpatien-value">69.50</span>
          </template>
        </div>
        <div
          class="win-patient-info__right--rows--item"
          :class="{skeleton:loading,active}"
        >
          <template v-if="!loading">
            <span class="outpatien-lable">过敏信息：</span>
            <span class="outpatien-value">青霉素类抗生素过敏</span>
          </template>
        </div>
      </div>
    </div>
    <el-link
      v-if="reset.show"
      type="primary"
      :underline="false"
      class="win-patient-info-refresh-btn"
      :style="resetStyle"
      @click="handlerReset"
    >
      <i
        class="el-icon-s-custom"
        style="font-weight: bolder"
      ></i>
      <span>新病人</span>
    </el-link>
  </div>
</template>

<script>
import WinPatientAvatar from './patient-avatar'
export default {
  name: 'win-patient-info',
  props: {
    simplify: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default: () => ({})
    },
    outpatientInfo: {
      type: Object,
      default: () => undefined
    },
    active: { // 展示动画
      type: Boolean,
      default: false
    },
    loading: { // 是否显示骨架屏
      type: Boolean,
      default: true
    },
    reset: {
      type: Object,
      required: true
    }
  },
  computed: {
    inforTags () {
      return this.userInfo.tags ? this.userInfo.tags.slice(0, 4) : []
    },
    resetStyle () {
      const { show, style = {} } = this.reset
      if (show) {
        return Object.keys(style).reduce((styles, key) => {
          styles[key] = style[key]
          return styles
        }, {})
      }
      return {}
    }
  },
  components: {
    [WinPatientAvatar.name]: WinPatientAvatar
  },
  methods: {
    handlerReset () {
      this.$emit('reset')
    }
  }
}
</script>
