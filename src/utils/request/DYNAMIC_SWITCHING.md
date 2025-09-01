# 动态切换底层实现

## 概述

新的统一请求系统支持在方法调用时动态选择底层实现，无需创建新的实例。这提供了极大的灵活性，让您可以根据不同的场景选择最适合的请求实现。

## 核心特性

### 1. 方法级别的实现选择

```typescript
import { HttpRequest, RequestType } from '@/utils/request';

// 同一个实例，不同的底层实现
const axiosData = await HttpRequest.get('/api/data', {}, { requestType: RequestType.AXIOS });
const fetchData = await HttpRequest.get('/api/data', {}, { requestType: RequestType.FETCH });

// 或者直接使用字符串（更简洁）
const axiosData2 = await HttpRequest.get('/api/data', {}, { requestType: 'axios' });
const fetchData2 = await HttpRequest.get('/api/data', {}, { requestType: 'fetch' });
```

### 2. 优先级规则

实现选择的优先级（从高到低）：
1. `config.requestType` - 请求配置中的类型
2. `options.requestType` - 请求选项中的类型  
3. `defaultRequestType` - 实例的默认类型

```typescript
// 示例：优先级演示
const request = createRequest({ type: RequestType.AXIOS }); // 默认 Axios

// 这次使用 Fetch（options 优先级高于默认值）
const data1 = await request.get('/api/data', {}, { requestType: RequestType.FETCH });

// 这次使用 Axios（默认值）
const data2 = await request.get('/api/data');

// 使用字符串版本
const data3 = await request.get('/api/data', {}, { requestType: 'fetch' });
```

## 使用场景

### 1. 环境适配

```typescript
// 根据环境选择实现
function getRequestType(): RequestType {
  if (import.meta.env.MODE === 'development') {
    return RequestType.FETCH; // 开发环境使用 Fetch
  }
  return RequestType.AXIOS; // 生产环境使用 Axios
}

const data = await HttpRequest.get('/api/data', {}, { 
  requestType: getRequestType() 
});
```

### 2. 网络条件适配

```typescript
// 根据网络条件选择实现
async function adaptiveRequest(url: string) {
  const isOnline = navigator.onLine;
  const requestType = isOnline ? RequestType.AXIOS : RequestType.FETCH;
  
  return HttpRequest.get(url, {}, { requestType });
}
```

### 3. 错误重试机制

```typescript
// 实现失败时自动切换
async function robustRequest(url: string) {
  try {
    // 首先尝试 Axios
    return await HttpRequest.get(url, {}, { requestType: RequestType.AXIOS });
  } catch (error) {
    console.log('Axios 失败，切换到 Fetch');
    // 失败时切换到 Fetch
    return await HttpRequest.get(url, {}, { requestType: RequestType.FETCH });
  }
}
```

### 4. 性能优化

```typescript
// 根据请求大小选择实现
async function optimizedRequest(url: string, data?: any) {
  const isLargeRequest = data && JSON.stringify(data).length > 10000;
  const requestType = isLargeRequest ? RequestType.FETCH : RequestType.AXIOS;
  
  return HttpRequest.post(url, data, { requestType });
}
```

### 5. 功能特性选择

```typescript
// 根据需要的功能选择实现
async function featureBasedRequest(url: string, needProgress = false) {
  // 如果需要上传进度，使用 Axios
  // 如果需要更轻量级，使用 Fetch
  const requestType = needProgress ? RequestType.AXIOS : RequestType.FETCH;
  
  return HttpRequest.post(url, data, { requestType });
}
```

## 实际应用示例

### 1. 服务层封装

```typescript
// services/apiService.ts
import { HttpRequest, RequestType } from '@/utils/request';

export class ApiService {
  // 根据配置选择实现
  static async getData(url: string, useFetch = false) {
    const requestType = useFetch ? RequestType.FETCH : RequestType.AXIOS;
    return HttpRequest.get(url, {}, { requestType });
  }
  
  // 根据数据大小选择实现
  static async uploadData(url: string, data: any) {
    const isLarge = JSON.stringify(data).length > 5000;
    const requestType = isLarge ? RequestType.FETCH : RequestType.AXIOS;
    return HttpRequest.post(url, data, { requestType });
  }
}
```

### 2. React Hook 封装

```typescript
// hooks/useApi.ts
import { useState, useCallback } from 'react';
import { HttpRequest, RequestType } from '@/utils/request';

export function useApi() {
  const [loading, setLoading] = useState(false);
  
  const request = useCallback(async (url: string, options?: any) => {
    setLoading(true);
    try {
      // 根据网络状态选择实现
      const requestType = navigator.onLine ? RequestType.AXIOS : RequestType.FETCH;
      return await HttpRequest.get(url, {}, { requestType, ...options });
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { request, loading };
}
```

### 3. 中间件模式

```typescript
// middleware/requestMiddleware.ts
import { HttpRequest, RequestType } from '@/utils/request';

export function createRequestMiddleware() {
  return {
    // 请求前中间件
    beforeRequest: (config: any) => {
      // 根据某些条件修改请求类型
      if (config.url.includes('/upload')) {
        config.requestType = RequestType.AXIOS; // 上传使用 Axios
      }
      return config;
    },
    
    // 请求后中间件
    afterRequest: (response: any) => {
      return response;
    }
  };
}
```

## 最佳实践

### 1. 统一配置

```typescript
// 在项目入口配置默认行为
import { HttpRequest } from '@/utils/request';

// 设置全局默认实现选择逻辑
const originalGet = HttpRequest.get;
HttpRequest.get = function(url: string, params?: any, options?: any) {
  // 根据 URL 自动选择实现
  const requestType = url.includes('/api/v2') ? RequestType.FETCH : RequestType.AXIOS;
  return originalGet.call(this, url, params, { ...options, requestType });
};
```

### 2. 类型安全

```typescript
// 创建类型安全的请求函数
import { RequestType } from '@/utils/request';

type RequestTypeConfig = {
  [K in keyof typeof RequestType]: typeof RequestType[K];
};

function createTypedRequest<T extends RequestType>(type: T) {
  return {
    get: (url: string, params?: any, options?: any) => 
      HttpRequest.get(url, params, { ...options, requestType: type }),
    post: (url: string, data?: any, options?: any) => 
      HttpRequest.post(url, data, { ...options, requestType: type }),
  };
}

const axiosApi = createTypedRequest(RequestType.AXIOS);
const fetchApi = createTypedRequest(RequestType.FETCH);
```

### 3. 错误处理

```typescript
// 统一的错误处理和重试机制
async function resilientRequest(url: string, data?: any) {
  const implementations = [RequestType.AXIOS, RequestType.FETCH];
  
  for (const requestType of implementations) {
    try {
      return await HttpRequest.post(url, data, { requestType });
    } catch (error) {
      console.log(`${requestType} 实现失败，尝试下一个`);
      if (requestType === implementations[implementations.length - 1]) {
        throw error; // 所有实现都失败了
      }
    }
  }
}
```

## 注意事项

1. **性能考虑**: 动态切换不会影响性能，因为实例在初始化时就已经创建了所有底层实现
2. **内存使用**: 每个实例都会同时创建 Axios 和 Fetch 实例，内存使用会稍微增加
3. **一致性**: 建议在同一个模块或服务中保持一致的实现选择策略
4. **调试**: 可以通过日志记录实际使用的实现类型，便于调试

## 总结

动态切换功能让您可以在不改变代码结构的情况下，灵活选择最适合的请求实现。这为处理不同的网络环境、性能需求和功能特性提供了强大的工具。
