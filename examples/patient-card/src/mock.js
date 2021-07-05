export const data = {
  generalIndexServiceId: 127306955959226368,
  generalIndexServiceCode: 399297147,
  maxDisplayedSearchMethods: 1,
  cloudGeneralIndexServiceId: null,
  indexServiceBaseUrl: null,
  enabledFlag: 98175,
  generalIndexServiceName: '患者信息检索组件',
  indexSearchMethods: [
    {
      indexSearchMethodId: 127306955959226368,
      interfaceOriginFlag: 98176,
      cloudIndexSearchMethodId: null,
      identitySearchFlag: 98175,
      indexSearchMethodTypeCode: 399297154,
      indexSearchMethodName: '身份证',
      memo: null,
      defaultFlag: 98175,
      seqNo: 1,
      cloudGeneralIdxSvcSetId: null,
      identitySearchSettings: [
        {
          identitySearchSetId: 127306958106710016,
          identitySearchTypeCode: 152695,
          defaultFlag: 98175,
          cloudIdentitySearchSetId: null
        }
      ],
      nonIdentitySearchSettings: null
    }
  ]
}

export const test = {
  indexSearchResult:
{
  tableColumnList: [
    {
      columnIndex: 1,
      columnChineseName: '患者标识',
      primaryKeyFlag: 98175,
      displayFlag: 98176
    },
    {
      columnIndex: 2,
      columnChineseName: '患者姓名',
      primaryKeyFlag: 98176,
      displayFlag: 98175
    },
    {
      columnIndex: 3,
      columnChineseName: '性别',
      primaryKeyFlag: 98176,
      displayFlag: 98175
    },
    {
      columnIndex: 4,
      columnChineseName: '年龄',
      primaryKeyFlag: 98176,
      displayFlag: 98175
    }
  ],
  resultDataSet: [
    {
      columnData: [
        {
          columnIndex: 1,
          dataValue: 9287492347223,
          primaryKeyFlag: '98175'
        },
        {
          columnIndex: 2,
          dataValue: '张三'
        },
        {
          columnIndex: 3,
          dataValue: '男'
        },
        {
          columnIndex: 4,
          dataValue: 30
        }
      ]
    },
    {
      columnData: [
        {
          columnIndex: 1,
          dataValue: 928733333221
        },
        {
          columnIndex: 2,
          dataValue: '李四'
        },
        {
          columnIndex: 3,
          dataValue: '男'
        },
        {
          columnIndex: 4,
          dataValue: 24
        }
      ]
    }
  ]
}
}
