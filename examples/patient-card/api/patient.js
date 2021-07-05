// eslint-disable-next-line node/no-unpublished-import
import Request from '../../../packages/win-request';

const request = new Request({ baseURL: '/outpat-person' });
const request2 = new Request({ baseURL: '/schedule-outpatient' });
const request3 = new Request({ baseURL: '/encounter-patient' });

// 获取系统卡类型列表
const getCardListUrl = '/api/v1/person_cis/identity_entry_app_settings/query/by_example';
const getSettingCardListUrl = '/api/v1/person_patient/card_component/query/by_code'; // 获取动态的配置标签
const getPersonListUrl = '/api/v1/app_encounter_schedule/person_info/query/by_example';
const getPersonInfoUrl = '/api/v1/person_cis/role_identity_index/query/by_biz_role_id';

export const getCardList = request.temp(getCardListUrl, {
  failTxt: '获取系统卡类型失败',
  repeat: true,
  cover: false
});
export const getSettingCardList = request3.temp(getSettingCardListUrl, {
  failTxt: '获取读卡配置信息失败',
  repeat: true,
  cover: false
});

export const getPersonList = request2.temp(getPersonListUrl, {
  failTxt: '获取患者列表失败',
  repeat: true,
  cover: false
});

export const getPersonInfo = request.temp(getPersonInfoUrl, {
  failTxt: '获取患者个人身份标志信息失败',
  repeat: true,
  cover: false
});

export default {
  getCardList,
  getPersonList,
  getPersonInfo,
  getSettingCardList
};
