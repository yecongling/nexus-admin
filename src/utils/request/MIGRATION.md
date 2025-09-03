# 请求封装迁移指南

## 概述

我们已经成功将原有的 Axios 和 Fetch 两套请求封装整合为一个统一的请求系统。新的系统提供了更清晰的 API 和更好的类型支持。

## 主要改进

### 1. 统一接口
- 提供一致的 API，无论使用 Axios 还是 Fetch
- 简化的方法调用，减少配置复杂度
- 完整的 TypeScript 类型支持

### 2. 灵活切换
- 通过参数轻松切换请求实现方式
- 默认使用 Axios，可显式选择 Fetch
- 支持运行时动态选择

### 3. 清晰的文件结构
```
src/utils/request/
├── index.ts              # 主入口文件
├── types.ts              # 统一类型定义
├── UnifiedRequest.ts     # 统一请求类
├── factory.ts            # 工厂函数
├── helper.ts             # 工具函数
├── README.md             # 使用文档
├── MIGRATION.md          # 迁移指南
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

## 迁移步骤

### 1. 更新导入语句

**之前:**
```typescript
import { HttpRequest } from '@/utils/request';
import { FetchRequest } from '@/utils/request/fetch';
```

**现在:**
```typescript
import { 
  HttpRequest,       // 统一请求入口（默认 Axios）
  AxiosRequest,      // Axios 请求实例
  FetchRequest,      // Fetch 请求实例
  createRequest      // 创建自定义请求实例
} from '@/utils/request';
```

### 2. 更新请求调用

**之前:**
```typescript
// Axios 请求
const data = await HttpRequest.get('/api/users');
const result = await HttpRequest.post('/api/users', userData);

// Fetch 请求
const data = await FetchRequest.get('/api/users');
const result = await FetchRequest.post('/api/users', userData);
```

**现在:**
```typescript
// 使用统一请求入口（推荐）
const data = await HttpRequest.get('/api/users');
const result = await HttpRequest.post('/api/users', userData);

// 或者使用具体的实现实例
const data = await AxiosRequest.get('/api/users');
const result = await FetchRequest.post('/api/users', userData);
```

### 3. 创建自定义请求实例

**之前:**
```typescript
// 需要手动创建和配置
const customAxios = createAxios({ timeout: 5000 });
const customFetch = createFetch({ timeout: 5000 });
```

**现在:**
```typescript
import { createRequest, RequestType } from '@/utils/request';

// 创建自定义 Axios 实例
const customAxios = createRequest({ 
  type: RequestType.AXIOS,
  config: { timeout: 5000 }
});

// 创建自定义 Fetch 实例
const customFetch = createRequest({ 
  type: RequestType.FETCH,
  config: { timeout: 5000 }
});
```

## 向后兼容性

为了确保平滑迁移，我们保持了向后兼容性：

### 原有 API 仍然可用
```typescript
// 这些导入仍然有效（现在作为 Legacy 导出）
import { LegacyHttpRequest, LegacyFetchRequest } from '@/utils/request';

// 这些调用仍然有效
const data = await LegacyHttpRequest.get('/api/users');
const result = await LegacyFetchRequest.post('/api/users', userData);

// 新的推荐方式
import { HttpRequest, AxiosRequest, FetchRequest } from '@/utils/request';
const data1 = await HttpRequest.get('/api/users');      // 统一入口
const data2 = await AxiosRequest.get('/api/users');     // Axios 实例
const data3 = await FetchRequest.get('/api/users');     // Fetch 实例
```

### 建议的迁移策略

1. **渐进式迁移**: 新代码使用新的统一 API，旧代码可以逐步迁移
2. **统一选择**: 在项目中统一使用一种实现方式（推荐 Axios）
3. **类型安全**: 利用新的 TypeScript 类型定义提高代码质量

## 新功能特性

### 1. 简化的方法调用
```typescript
// 更简洁的 API
const users = await HttpRequest.get('/api/users');
const newUser = await HttpRequest.post('/api/users', userData);
```

### 2. 统一的错误处理
```typescript
try {
  const data = await HttpRequest.get('/api/users');
} catch (error) {
  // 统一的错误处理
  console.error('请求失败:', error);
}
```

### 3. 灵活的配置
```typescript
const request = createRequest({
  type: RequestType.AXIOS,
  config: {
    timeout: 5000,
    headers: {
      'Authorization': 'Bearer token'
    }
  }
});
```

## 最佳实践

### 1. 项目级配置
```typescript
// 在项目入口文件中配置默认请求实例
import { createRequest, RequestType } from '@/utils/request';

export const apiRequest = createRequest({
  type: RequestType.AXIOS,
  config: {
    timeout: 10000,
    requestOptions: {
      apiUrl: '/api/v1',
      errorMessageMode: 'message'
    }
  }
});

// 或者直接使用预定义的实例
import { HttpRequest, AxiosRequest, FetchRequest } from '@/utils/request';
export { HttpRequest as ApiRequest }; // 重命名为 ApiRequest
```

### 2. 服务层封装
```typescript
// 在服务层使用统一的请求实例
import { HttpRequest } from '@/utils/request';

export class UserService {
  static async getUsers() {
    return HttpRequest.get('/users');
  }
  
  static async createUser(userData: any) {
    return HttpRequest.post('/users', userData);
  }
}
```

### 3. 错误处理
```typescript
// 统一的错误处理策略
export async function handleApiRequest<T>(
  requestFn: () => Promise<T>
): Promise<T> {
  try {
    return await requestFn();
  } catch (error) {
    // 统一的错误处理逻辑
    console.error('API 请求失败:', error);
    throw error;
  }
}
```

## 总结

新的统一请求系统提供了：
- ✅ 更清晰的 API 设计
- ✅ 更好的类型安全
- ✅ 更灵活的实现选择
- ✅ 完整的向后兼容性
- ✅ 详细的文档和示例

建议在新项目中直接使用新的统一 API，在现有项目中可以渐进式迁移。
