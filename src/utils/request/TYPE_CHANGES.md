# RequestType 类型变更说明

## 变更概述

将 `RequestType` 从枚举（enum）改为字符串字面量类型 + 常量对象的方式，提供更灵活的使用体验。

## 变更前（枚举方式）

```typescript
export enum RequestType {
  AXIOS = 'axios',
  FETCH = 'fetch',
}

// 使用方式
import { RequestType } from '@/utils/request';
const data = await HttpRequest.get('/api/data', {}, { requestType: RequestType.AXIOS });
```

## 变更后（字符串字面量类型 + 常量对象）

```typescript
export type RequestType = 'axios' | 'fetch';

export const RequestType = {
  AXIOS: 'axios' as const,
  FETCH: 'fetch' as const,
} as const;

// 使用方式1：使用常量对象（推荐）
import { RequestType } from '@/utils/request';
const data = await HttpRequest.get('/api/data', {}, { requestType: RequestType.AXIOS });

// 使用方式2：直接使用字符串（更简洁）
const data2 = await HttpRequest.get('/api/data', {}, { requestType: 'axios' });
```

## 优势

### 1. 更灵活的使用方式

```typescript
// 可以使用常量对象
const axiosData = await HttpRequest.get('/api/data', {}, { requestType: RequestType.AXIOS });

// 也可以直接使用字符串
const fetchData = await HttpRequest.get('/api/data', {}, { requestType: 'fetch' });

// 动态选择
const requestType = someCondition ? 'axios' : 'fetch';
const data = await HttpRequest.get('/api/data', {}, { requestType });
```

### 2. 更好的类型推断

```typescript
// TypeScript 可以更好地推断类型
function createRequest(type: RequestType) {
  return HttpRequest.get('/api/data', {}, { requestType: type });
}

// 支持字符串字面量
createRequest('axios'); // ✅ 类型安全
createRequest('fetch'); // ✅ 类型安全
createRequest('other'); // ❌ 类型错误
```

### 3. 更小的打包体积

- 枚举会生成额外的 JavaScript 代码
- 字符串字面量类型在编译后不会产生额外的运行时代码
- 常量对象只在需要时使用

### 4. 更好的 Tree Shaking

```typescript
// 如果只使用字符串，不会引入常量对象
const data = await HttpRequest.get('/api/data', {}, { requestType: 'axios' });

// 只有在使用常量对象时才会引入
import { RequestType } from '@/utils/request';
const data = await HttpRequest.get('/api/data', {}, { requestType: RequestType.AXIOS });
```

## 迁移指南

### 现有代码无需修改

```typescript
// 这些代码仍然有效
import { RequestType } from '@/utils/request';
const data = await HttpRequest.get('/api/data', {}, { requestType: RequestType.AXIOS });
```

### 新的使用方式

```typescript
// 可以直接使用字符串（更简洁）
const data = await HttpRequest.get('/api/data', {}, { requestType: 'axios' });

// 动态选择
const requestType = condition ? 'axios' : 'fetch';
const data = await HttpRequest.get('/api/data', {}, { requestType });
```

## 类型安全

```typescript
// 类型定义确保只能使用有效的值
type RequestType = 'axios' | 'fetch';

// 这些都会通过类型检查
const valid1: RequestType = 'axios';
const valid2: RequestType = 'fetch';
const valid3: RequestType = RequestType.AXIOS;
const valid4: RequestType = RequestType.FETCH;

// 这些会报类型错误
const invalid1: RequestType = 'other'; // ❌ 类型错误
const invalid2: RequestType = 'XMLHttpRequest'; // ❌ 类型错误
```

## 实际应用示例

### 1. 条件选择

```typescript
// 根据环境选择
function getRequestType(): RequestType {
  return import.meta.env.MODE === 'development' ? 'fetch' : 'axios';
}

const data = await HttpRequest.get('/api/data', {}, { 
  requestType: getRequestType() 
});
```

### 2. 配置驱动

```typescript
// 从配置中读取
const config = {
  requestType: 'axios' as RequestType
};

const data = await HttpRequest.get('/api/data', {}, { 
  requestType: config.requestType 
});
```

### 3. 用户选择

```typescript
// 用户偏好设置
const userPreference = localStorage.getItem('requestType') as RequestType || 'axios';

const data = await HttpRequest.get('/api/data', {}, { 
  requestType: userPreference 
});
```

## 总结

这次变更提供了：

- ✅ **向后兼容**: 现有代码无需修改
- ✅ **更灵活**: 支持字符串和常量对象两种使用方式
- ✅ **更简洁**: 可以直接使用字符串字面量
- ✅ **类型安全**: 完整的 TypeScript 类型支持
- ✅ **更小体积**: 减少打包体积
- ✅ **更好性能**: 更好的 Tree Shaking 支持

推荐在简单场景下直接使用字符串，在需要类型安全或代码可读性的场景下使用常量对象。
