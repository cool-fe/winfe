import patientCard from './src/patient-card.vue';

patientCard.install = function (Vue) {
  Vue.component(patientCard.name, patientCard);
};

export default patientCard;
