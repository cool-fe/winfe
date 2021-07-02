// import Request from 'his-request'
// eslint-disable-next-line node/no-unpublished-import
import Request from '../../../packages/win-request';

const { user } = Request.getCookieData();

export default {
  data() {
    return {
      options: [],
      remoteInfoApi: '',
      primaryKey: '98175', // 主键
      tableColumnList: []
    };
  },
  methods: {
    getRemoteApi() {
      if (!this.indexServiceBaseUrl) return;
      const request = new Request({
        failTxt: '获取读卡信息失败',
        isAddHospitalSoid: false,
        cover: true
      });
      this.remoteInfoApi = request.temp(this.indexServiceBaseUrl);
    },
    /**
     * @param { 卡号或者输入框输入的字符 } indexSearchKeyword
     * @param { 身份标识 } identitySearchTypeCode
     * @param { 是否读卡 } isReadCard
     * @param {*} cb
     */
    async RemoteMethod(indexSearchKeyword, identitySearchTypeCode, isReadCard = false, cb) {
      // option缓存影响hover
      this.options = [];
      const cardType = this.cardType;
      if (!this.remoteInfoApi || !indexSearchKeyword) {
        this.popoverVisible = false;
        return;
      }
      const res = await this.remoteInfoApi({
        generalIndexServiceCode: this.generalIndexServiceCode,
        indexSearchTypeCode: identitySearchTypeCode,
        identitySearchFlag: cardType.identitySearchFlag,
        indexSearchKeyword, // 输入框输入
        soid: [user.hospitalSOID],
        hospitalSOID: user.hospitalSOID,
        ...this.extraParams
      });
      if (res.success) {
        let { tableColumnList, resultDataSet } = res.data ? res.data.indexSearchResult : {};
        tableColumnList = tableColumnList || [];
        resultDataSet = resultDataSet || [];
        this.tableColumnList = tableColumnList;
        let options = resultDataSet.map((item) => item.columnData);
        options = options.map((option) =>
          option.map((item) => {
            const tableColumn = tableColumnList.find(
              (column) => column.columnIndex === item.columnIndex
            );
            if (tableColumn) {
              return {
                columnIndex: tableColumn.columnIndex,
                primaryKeyFlag: tableColumn.primaryKeyFlag,
                columnChineseName: tableColumn.columnChineseName,
                displayFlag: tableColumn.displayFlag,
                dataValue: item.dataValue
              };
            }
          })
        );
        options = options.map((item) => {
          const primaryKeyItem = item.find((b) => b.primaryKeyFlag === this.primaryKey);
          return {
            id: primaryKeyItem.dataValue,
            list: JSON.parse(JSON.stringify(item))
          };
        });
        this.options = options || [];
        if (this.options.length) {
          // 档案是否已停用
          const filter = this.tableColumnList.filter(
            (item) => item.columnChineseName === '启用标识'
          );
          this.options.forEach((item) => {
            if (filter.length && item.list[filter[0].columnIndex - 1].dataValue === '98176') {
              item.fileDisabled = true;
            }
          });
        } else {
          this.noDataText = '暂无数据';
        }
        if (typeof cb === 'function') cb();
      } else {
        this.popoverVisible = false;
      }
    },
    computedIdentitySearchTypeCode(cardType) {
      const primaryKey = '98175'; // this.primaryKey
      const { identitySearchSettings, nonIdentitySearchSettings } = cardType;
      const searchSettings =
        cardType.identitySearchFlag === primaryKey
          ? identitySearchSettings
          : nonIdentitySearchSettings;
      if (!searchSettings || searchSettings.length === 0) return '';
      const identitySearchTypeList = searchSettings.filter(
        (item) => item.defaultFlag === primaryKey
      );
      // 没有默认值但是数组有值的情况取第一个
      const attr =
        cardType.identitySearchFlag === primaryKey
          ? 'identitySearchTypeCode'
          : 'nonIdSearchTypeCode';
      if (identitySearchTypeList.length > 0) {
        return identitySearchTypeList[0][attr];
      } else {
        return searchSettings[0][[attr]];
      }
    },
    // 是否包含启用标志
    queryEnabledFlagIndex() {
      const filter = this.tableColumnList.filter((item) => item.columnChineseName === '启用标识');
      return filter.length ? filter[0].columnIndex - 1 : -1;
    }
  }
};
