<template>
  <div
    class="win-patient-avatar"
    :style="{
          width: width + 'px',
          height: width + 'px'
        }"
  >
    <div :class="['win-patient-avatar__img', isBorder ? 'is-border' : '']">
      <template v-if="!url">
        <!-- <svg
          aria-hidden="true"
          :width="width"
          :height="width"
        >
          <use :xlink:href="avatarName"></use>
        </svg> -->
        <winAvatar
          :width="width"
          :height="width"
        ></winAvatar>
      </template>
      <template v-else>
        <img
          :src="
          url"
          width="100%"
          alt=""
        >
      </template>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import winAvatar from '../../win-avatar/src/winAvatar.vue'
const avatarConf = {
  2568131: 'baby_boy',
  2568132: 'baby_girl',
  2568141: 'baby_boy',
  2568142: 'baby_girl',
  2568151: 'child_boy',
  2568152: 'child_girl',
  2568161: 'adult_boy',
  2568162: 'adult_girl',
  2568171: 'adult_boy',
  2568172: 'adult_girl',
  2568181: 'adult_boy',
  2568182: 'adult_girl',
  2568191: 'old_boy',
  2568192: 'old_girl'
}

export default {
  name: 'WinPatientAvatar',
  components: {
    winAvatar
  },
  data () {
    return {
      avatarName: 'default_avatar'
    }
  },
  props: {
    width: {
      type: [Number, String],
      default: 88
    },
    url: {
      type: String
    },
    gender: {
      type: String,
      default: '50604'
    },
    code: {
      type: [String, Number],
      default: 0
    },
    isBorder: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.handleAvatarName(this.gender, this.code)
  },
  methods: {
    handleAvatarName (gender, code) {
      let name = 'default_avatar'
      if (code && this.genderCode) {
        name = this.genderCode === 9 ? 'unknown_person' : avatarConf[`${code}${this.genderCode}`]
      }
      this.avatarName = name === 'default_avatar' ? '#icon-default_avatar' : `/portal/css/avatar/avatar.svg#${name}`
    }
  },
  computed: {
    genderCode () {
      let code = 9 // 0 未知 1 男 2 女 9 默认
      if (this.gender === '50601') {
        code = 0
      } else if (this.gender === '50602') {
        code = 1
      } else if (this.gender === '50603') {
        code = 2
      }
      return code
    }
  },
  watch: {
    code (val) {
      this.handleAvatarName(this.genderCode, val)
    },
    gender (val) {
      this.handleAvatarName(val, this.code)
    }
  }
}
</script>
