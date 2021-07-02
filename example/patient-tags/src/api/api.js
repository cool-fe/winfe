import Request from 'his-request'

const patientRequest1 = new Request({
  baseURL: '/person_component/',
  repeat: true
})
const patientRequest2 = new Request({
  baseURL: '/outpat-person/',
  repeat: true
})

export const apiQueryPatientTags = patientRequest1.temp('/api/v1/person_component/tag_info/query/by_example')

/**
 * params: {
    "bizRoleId": 0,
    "personalTagIds": [
      {
        "isSelected": 0,
        "personalTagId": 0
      }
    ]
  }
 */
export const apiSavePatientTags = patientRequest2.temp('/api/v1/person_cis/patient_tag/save')
