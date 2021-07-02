import PatientTags from './src/patient-tags.vue'

PatientTags.install = function (Vue) {
  Vue.component(PatientTags.name, PatientTags)
}

window.Vue && window.Vue.use(PatientTags)
export default PatientTags
