# 统一请求封装

这个模块提供了统一的 HTTP 请求接口，支持 Axios 和 Fetch 两种实现方式，可以根据需要灵活选择。

## 特性

- 🚀 **统一接口**: 提供一致的 API，无论使用 Axios 还是 Fetch
- 🔄 **灵活切换**: 通过参数轻松切换请求实现方式
- 📦 **向后兼容**: 保持原有 API 的兼容性
- 🛡️ **类型安全**: 完整的 TypeScript 类型支持
- 🎯 **简单易用**: 简化的方法调用，减少配置复杂度

## 快速开始

### 基本使用

```typescript
import { createRequest, RequestType } from '@/utils/request';

// 创建默认请求实例（使用 Axios）
const request = createRequest();

// 创建使用 Fetch 的请求实例
const fetchRequest = createRequest({ type: RequestType.FETCH });

// 发起请求
const data = await request.get('/api/users');
const result = await request.post('/api/users', { name: 'John' });
```

### 便捷方法

```typescript
import { 
  HttpRequest,     // 统一请求入口（默认 Axios）
  AxiosRequest,    // Axios 请求实例
  FetchRequest     // Fetch 请求实例
} from '@/utils/request';

// 使用统一入口（推荐）
const data = await HttpRequest.get('/api/users');

// 使用 Axios
const axiosData = await AxiosRequest.get('/api/users');

// 使用 Fetch
const fetchData = await FetchRequest.get('/api/users');
```

## API 参考

### 统一请求类 (UnifiedRequest)

#### 构造函数

```typescript
new UnifiedRequest(options?: UnifiedRequestOptions)
```

**参数:**
- `options.type`: 请求类型，`RequestType.AXIOS` 或 `RequestType.FETCH`，默认为 `RequestType.AXIOS`
- `options.config`: 基础配置选项

#### 方法

##### request(config, options?)

通用请求方法

```typescript
request<T = any>(config: UnifiedRequestConfig, options?: RequestOptions): Promise<T>
```

**参数:**
- `config.url`: 请求地址
- `config.method`: 请求方法 (GET, POST, PUT, DELETE, PATCH)
- `config.headers`: 请求头
- `config.data`: 请求数据
- `config.params`: 查询参数
- `config.timeout`: 超时时间

##### get(url, params?, options?)

GET 请求

```typescript
get<T = any>(url: string, params?: Record<string, any>, options?: RequestOptions): Promise<T>
```

##### post(url, data?, options?)

POST 请求

```typescript
post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T>
```

##### put(url, data?, options?)

PUT 请求

```typescript
put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T>
```

##### delete(url, params?, options?)

DELETE 请求

```typescript
delete<T = any>(url: string, params?: Record<string, any>, options?: RequestOptions): Promise<T>
```

##### patch(url, data?, options?)

PATCH 请求

```typescript
patch<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T>
```

## 使用示例

### 基础请求

```typescript
import { HttpRequest } from '@/utils/request';

// GET 请求
const users = await HttpRequest.get('/api/users');

// POST 请求
const newUser = await HttpRequest.post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT 请求
const updatedUser = await HttpRequest.put('/api/users/1', {
  name: 'Jane Doe'
});

// DELETE 请求
await HttpRequest.delete('/api/users/1');
```

### 带参数的请求

```typescript
// GET 请求带查询参数
const filteredUsers = await HttpRequest.get('/api/users', {
  page: 1,
  limit: 10,
  status: 'active'
});

// 自定义请求头
const data = await HttpRequest.post('/api/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### 动态切换请求实现

```typescript
import { HttpRequest, RequestType } from '@/utils/request';

// 在方法调用时动态选择实现
const axiosData = await HttpRequest.get('/api/data', {}, { requestType: RequestType.AXIOS });
const fetchData = await HttpRequest.get('/api/data', {}, { requestType: RequestType.FETCH });

// 或者直接使用字符串
const axiosData2 = await HttpRequest.get('/api/data', {}, { requestType: 'axios' });
const fetchData2 = await HttpRequest.get('/api/data', {}, { requestType: 'fetch' });

// 或者使用具体的实例（也支持动态切换）
import { AxiosRequest, FetchRequest } from '@/utils/request';
const axiosData3 = await AxiosRequest.get('/api/data', {}, { requestType: RequestType.FETCH }); // 这次使用 Fetch
const fetchData3 = await FetchRequest.get('/api/data', {}, { requestType: RequestType.AXIOS }); // 这次使用 Axios
```

### 自定义配置

```typescript
import { createRequest, RequestType } from '@/utils/request';

const customRequest = createRequest({
  type: RequestType.AXIOS,
  config: {
    timeout: 5000,
    headers: {
      'Authorization': 'Bearer token'
    }
  }
});
```

## 向后兼容

原有的 API 仍然可用：

```typescript
// 原有的 Axios 请求（现在作为 LegacyHttpRequest 导出）
import { LegacyHttpRequest } from '@/utils/request';
const data = await LegacyHttpRequest.get('/api/users');

// 原有的 Fetch 请求（现在作为 LegacyFetchRequest 导出）
import { LegacyFetchRequest } from '@/utils/request';
const data = await LegacyFetchRequest.get('/api/users');

// 新的统一 API（推荐使用）
import { HttpRequest, AxiosRequest, FetchRequest } from '@/utils/request';
const data1 = await HttpRequest.get('/api/users');      // 统一入口
const data2 = await AxiosRequest.get('/api/users');     // Axios 实例
const data3 = await FetchRequest.get('/api/users');     // Fetch 实例
```

## 文件夹结构

```
src/utils/request/
├── index.ts              # 主入口文件
├── types.ts              # 类型定义
├── UnifiedRequest.ts     # 统一请求类
├── factory.ts            # 工厂函数
├── helper.ts             # 工具函数
├── axios/                # Axios 相关
│   ├── index.ts
│   ├── Axios.ts
│   └── transform.tsx
└── fetch/                # Fetch 相关
    ├── index.ts
    ├── Fetch.ts
    ├── types.ts
    └── transform.tsx
```

## 注意事项

1. 默认使用 Axios 实现，如需使用 Fetch 请显式指定
2. 两种实现方式在功能上基本一致，但某些高级特性可能有差异
3. 支持在方法调用时动态选择底层实现，无需创建新实例
4. 所有请求都支持统一的错误处理和拦截器机制
5. 动态切换不会影响实例的默认行为，只是单次请求的选择
