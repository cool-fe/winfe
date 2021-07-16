// import Message from 'winning-components/lib/message-ex';
import { Message } from 'element-ui';
import { dispatchEvent } from '../util/new_dll_event';
import { dispatchEvent as oldDispatchEvent } from '../util/dll_event';

const winning = window.winning || window.top.winning;

export default class Winning {
  constructor() {
    this.showError = true;
  }
  get winning() {
    if (!winning) {
      this.showError &&
        Message({
          type: 'warning',
          message: '请在WINEX环境中使用'
        });
      this.showError = true;
      throw new Error('请在WINEX环境中使用');
    }
    this.showError = true;
    return winning;
  }
  _dispatchEvent(id, params) {
    const dispatchEventFunc = dispatchEvent.bind(this);
    return new Promise((resolve, reject) => {
      dispatchEventFunc(id, params, reject, (res, err) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
  _dispatchOldEvent(desc, params) {
    const dispatchEventFunc = oldDispatchEvent.bind(this);
    return new Promise((resolve, reject) => {
      dispatchEventFunc(desc, params, reject, (res, err) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  static checkEnvironment() {
    return !!winning;
  }

  static instance = new Winning();
  /**
   * 获取Mac地址
   */
  static getMacAddress() {
    try {
      this.instance.showError = false;
      return this.instance.winning.getMacadress();
    } catch (error) {
      return '';
    }
  }
  /**
   * 获取IP地址
   */
  static getIpAddress() {
    try {
      this.instance.showError = false;
      return this.instance.winning.getIP();
    } catch (error) {
      return '';
    }
  }
  /**
   * 对账
   */
  static reconciliation(params) {
    return this.instance._dispatchEvent('399392597', params);
  }
  /**
   * 票据打印
   * @param {*} params
   */
  static issuingPrint(params) {
    return this.instance._dispatchEvent('399297290', params);
  }
  /**
   * 读卡
   * @param {*} params
   */
  static readcard(params) {
    this.instance.showError = false;
    return this.instance._dispatchEvent('399297247', params);
  }
  /**
   * 充值
   * @param {*} params
   */
  static recharge(params, name = 'recharge') {
    return this.instance._dispatchOldEvent({ id: '956503', name }, params);
  }
  /**
   * 退费
   * @param {*} params
   */
  static refund(params, name) {
    return this.instance._dispatchOldEvent({ id: '957986', name }, params);
  }

  /**
   *
   *
   * 红冲退卡
   * @memberof Winning
   */
  static refundCard(params, name) {
    return this.instance._dispatchOldEvent({ id: '4304876094', name }, params);
  }

  /**
   * 获取门诊医保预算结果
   * @param {object} parmas
   */
  static getOutDInsuranceBudget(params) {
    return this.instance._dispatchEvent('399299519', params);
  }

  /**
   * 获取挂号医保预算结果
   * @param {object} params
   */
  static getRegInsuranceBudget(params) {
    return this.instance._dispatchEvent('399299519', params);
  }

  /**
   * 获取门诊医保正算结果
   * @param {object} params
   */
  static getOutDInsuranceZS(params) {
    return this.instance._dispatchEvent('399299518', params);
  }

  /**
   * 获取挂号医保正算结果
   * @param {object} params
   */
  static getRegInsuranceZS(params) {
    return this.instance._dispatchEvent('399299518', params);
  }

  /**
   * 收银支付
   * @param {object} params
   */
  static toPay(params) {
    return this.instance._dispatchEvent('399299520', params);
  }

  /**
   * 电子发票数量获取
   * @param {object} params
   */
  static invoiceInfo(params) {
    return this.instance._dispatchEvent('399302750', params);
  }

  /**
   * 取消第三方支付
   * @param {object} params
   */
  static cancelThirdPartyCharge(params) {
    return this.instance._dispatchEvent('399309972', params);
  }

  /**
   * 取消医保预算
   * @param {object} params
   */
  static cancelInsurPreSettled(params) {
    return this.instance._dispatchEvent('399309971', params);
  }

  /**
   * 取消医保正算
   * @param {object} params
   */
  static cancelInsurSettled(params) {
    return this.instance._dispatchEvent('399309970', params);
  }

  /**
   * 结账单图片生成
   * @param {object} params
   */
  static generateSettlementPic(params) {
    return this.instance._dispatchEvent('399303890', params);
  }
}
