# Fetch 请求封装

基于原生 fetch API 实现的 HTTP 请求封装，提供与 axios 封装相同的功能特性。

## 功能特性

### 1. 请求拦截器
- **Token 处理**：自动添加 Authorization 头
- **数据加密**：支持请求数据加密，加密密钥通过请求头传递
- **请求头配置**：自动设置 Content-Type 等请求头

### 2. 响应拦截器
- **Token 自动刷新**：401 错误时自动刷新 token 并重试请求
- **请求队列管理**：token 刷新期间将请求加入队列，避免重复刷新
- **登录状态处理**：token 刷新失败时自动跳转登录页

### 3. 数据转换
- **响应数据转换**：统一处理响应数据格式
- **错误处理**：统一的错误提示和处理机制
- **成功消息提示**：可配置的成功操作提示

### 4. 请求配置
- **URL 拼接**：支持 API 前缀和 URL 前缀配置
- **参数处理**：GET 请求自动添加时间戳，支持 RESTful 风格
- **超时控制**：支持请求超时设置
- **请求取消**：基于 AbortController 实现请求取消

### 5. 错误处理
- **网络错误**：处理网络连接异常
- **超时错误**：处理请求超时
- **服务器错误**：处理 4xx、5xx 状态码
- **业务错误**：处理业务逻辑错误

## 使用方法

### 基本用法

```typescript
import { FetchRequest } from '@/utils/request/fetch';

// GET 请求
const data = await FetchRequest.get({
  url: '/api/users',
  params: { page: 1, size: 10 }
});

// POST 请求
const result = await FetchRequest.post({
  url: '/api/users',
  data: { name: 'John', email: 'john@example.com' }
});
```

### 高级配置

```typescript
// 自定义请求选项
const result = await FetchRequest.post({
  url: '/api/users',
  data: userData
}, {
  // 不显示成功消息
  successMessageMode: 'none',
  // 使用 message 模式显示错误
  errorMessageMode: 'message',
  // 不加密数据
  encrypt: 0,
  // 返回原生响应
  isReturnNativeResponse: true
});
```

### 请求方法

- `get<T>(config, options?)`: GET 请求
- `post<T>(config, options?)`: POST 请求
- `put<T>(config, options?)`: PUT 请求
- `delete<T>(config, options?)`: DELETE 请求
- `patch<T>(config, options?)`: PATCH 请求

## 配置选项

### CreateFetchOptions

```typescript
interface CreateFetchOptions extends RequestInit {
  transform?: FetchTransform;
  requestOptions?: RequestOptions;
  _retry?: boolean;
  url?: string;
}
```

### RequestOptions

```typescript
interface RequestOptions {
  joinPrefix?: boolean;           // 是否添加 URL 前缀
  isReturnNativeResponse?: boolean; // 是否返回原生响应
  isTransformResponse?: boolean;   // 是否转换响应数据
  joinParamsToUrl?: boolean;       // 是否将参数拼接到 URL
  formatDate?: boolean;           // 是否格式化日期
  errorMessageMode?: 'modal' | 'message' | 'none'; // 错误消息模式
  successMessageMode?: 'success' | 'none'; // 成功消息模式
  apiUrl?: string;               // API 基础地址
  urlPrefix?: string;            // URL 前缀
  joinTime?: boolean;            // 是否添加时间戳
  ignoreCancelToken?: boolean;   // 是否忽略取消令牌
  encrypt?: 0 | 1;              // 是否加密数据
  token?: string;               // 自定义 token
  skipAuthInterceptor?: boolean; // 是否跳过认证拦截器
}
```

## 与 Axios 封装的对比

| 功能 | Axios 封装 | Fetch 封装 |
|------|------------|------------|
| 请求拦截器 | ✅ | ✅ |
| 响应拦截器 | ✅ | ✅ |
| Token 自动刷新 | ✅ | ✅ |
| 数据加密 | ✅ | ✅ |
| 错误处理 | ✅ | ✅ |
| 请求取消 | ✅ | ✅ |
| 超时控制 | ✅ | ✅ |
| 类型支持 | ✅ | ✅ |

## 注意事项

1. **浏览器兼容性**：需要支持 fetch API 的现代浏览器
2. **错误处理**：fetch 不会自动抛出 HTTP 错误状态码，需要在响应拦截器中处理
3. **请求体处理**：需要根据 Content-Type 手动处理不同类型的请求体
4. **取消请求**：使用 AbortController 实现请求取消功能

## 迁移指南

从 axios 封装迁移到 fetch 封装：

1. 导入方式变更：
   ```typescript
   // 之前
   import { HttpRequest } from '@/utils/request';
   
   // 现在
   import { FetchRequest } from '@/utils/request/fetch';
   ```

2. API 调用方式保持不变：
   ```typescript
   // 两种封装的使用方式完全相同
   const data = await FetchRequest.get({ url: '/api/users' });
   ```

3. 配置选项保持一致，无需修改现有代码。
