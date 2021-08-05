# request

@winfe/win-request 基于 `axios` 提供了一套统一的网络请求和错误处理方案。兼容`his-request`

## 启用方式

默认启用

## 介绍

### 安装

```javascript
npm install @winfe/win-request
# OR
yarn add @winfe/win-request
```

### 支持

- 自定义请求配置

```typescript
export interface AxiosRequestConfig {
  successTxt?: string;
  failTxt?: string;
  warning?: boolean;
  cover?: boolean;
  repeat?: boolean;
  isAddHospitalSoid?: boolean;
  isAddSoid?: boolean;
  baseUrl?: string;
  message?: MessageInstance;
  global?: boolean;
  checkFn?: (data: unknown) => boolean;
  transformData?: (data: unknown) => unknown;
  errorHandler?: (error: AxiosError) => void;
  showDetail?: boolean;
}
```

- 响应成功及异常的全局拦截统一处理

```typescript
export interface AxiosResponse {
  success: boolean;
  traceid: string;
  errorDetail: {
    id: string;
    path?: string;
    detailMsg?: string;
    fixMsg?: string;
    ipAddress?: string;
    message?: string;
    original?: string;
  };
  appid: string;
  hostip: string;
}
```

### 使用

```javascript
import Request from '@winfe/win-request';
import { Message } from 'element-ui';

const isProduction = process.env.NODE_ENV === 'production';

export const request = new Request({
  baseUrl: isProduction ? '/' : 'http://172.16.6.201:41200',
  warning: false, // 默认为 ture （是否使用默认错误提示）
  isAddHospitalSoid: false, // 默认为true （这里只是展示）
  message: Message
});

export default request;
```

## API

### service

通过 `{ service } = new Request(options)`;

options 具体格式参考 axios。service 的大部分用法等同于 axios，不同的是 options 扩展了一个[axios 配置](/plugins/request.html#支持)。

示例如下：

```javascript
service('/api/user', {
  params: {
    name: 1
  },
  successTxt: '请求成功'
});
```

### temp

核心 temp 方法返回一个 promise 对象

```javascript
/** 本服务计费 */
const { temp } = request
export const addOriginService = temp(url, {
  failTxt: '本服务计费设置添加失败！',
  successTxt: '本服务计费设置添加成功！',
  warning: false, // 关闭默认弹窗
  transformData: function (data) {
  	... // 处理data 的钩子
    return data
  },
  checkFn: function (data) {
	 ... // 可以校验api 入参 是否合法，不合法则取消这次请求
	 return data
	}
})
```

### getCookieData

该方法获取 cookie 信息, 它放回一个 object 包括 user 、header 信息

```javascript
import Request from '@winfe/win-request';
/*
 * @return { Object } Cookies
 */
const { user: userInfo, header } = Request.getCookieData();
```

返回数据

```typescript
export const COOKIE_DATA = {
  user: getUserInfo(),
  header: getRequestHeader()
};
```

```javascript
{
  user: {
    employeeId: // 员工id
    userId: // 用户id
    employeeNo: // 员工号
    employeeName: // 员工姓名
    hospitalSOID: // 医院soid
    userHospitalSOID: // 员工所属于医院 soid
    orgName: // 员工组织名称
  },
  header: {
    Authorization: '', // BEARER_TOKEN
    'W-FLOW': '', //
    'X-DEBUG': '',
    ip: ''
  }
}
```
