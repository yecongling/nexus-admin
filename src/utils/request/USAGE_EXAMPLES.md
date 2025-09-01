# 使用示例

## 新的统一请求 API 使用示例

### 1. 基础使用

```typescript
import { HttpRequest, AxiosRequest, FetchRequest } from '@/utils/request';

// 使用统一入口（推荐）
const users = await HttpRequest.get('/api/users');
const newUser = await HttpRequest.post('/api/users', { name: 'John' });

// 使用具体的实现实例
const axiosData = await AxiosRequest.get('/api/data');
const fetchData = await FetchRequest.get('/api/data');
```

### 2. 带参数的请求

```typescript
// GET 请求带查询参数
const filteredUsers = await HttpRequest.get('/api/users', {
  page: 1,
  limit: 10,
  status: 'active'
});

// POST 请求带数据
const result = await HttpRequest.post('/api/users', {
  name: 'Jane Doe',
  email: 'jane@example.com'
});

// PUT 请求更新数据
const updated = await HttpRequest.put('/api/users/1', {
  name: 'Jane Smith'
});

// DELETE 请求
await HttpRequest.delete('/api/users/1');
```

### 3. 动态切换底层实现

```typescript
import { HttpRequest, RequestType } from '@/utils/request';

// 同一个实例，动态选择不同的底层实现
const axiosData = await HttpRequest.get('/api/data', {}, { requestType: RequestType.AXIOS });
const fetchData = await HttpRequest.get('/api/data', {}, { requestType: RequestType.FETCH });

// 或者直接使用字符串（更简洁）
const axiosData2 = await HttpRequest.get('/api/data', {}, { requestType: 'axios' });
const fetchData2 = await HttpRequest.get('/api/data', {}, { requestType: 'fetch' });

// POST 请求也可以动态切换
const axiosResult = await HttpRequest.post('/api/users', userData, { requestType: RequestType.AXIOS });
const fetchResult = await HttpRequest.post('/api/users', userData, { requestType: RequestType.FETCH });
```

### 4. 自定义配置

```typescript
import { createRequest, RequestType } from '@/utils/request';

// 创建自定义实例（仍然支持动态切换）
const customRequest = createRequest({
  type: RequestType.AXIOS,
  config: {
    timeout: 5000,
    headers: {
      'Authorization': 'Bearer token'
    }
  }
});

// 即使创建时指定了 Axios，仍然可以动态切换到 Fetch
const fetchData = await customRequest.get('/api/data', {}, { requestType: RequestType.FETCH });
// 或者使用字符串
const fetchData2 = await customRequest.get('/api/data', {}, { requestType: 'fetch' });
```

### 5. 错误处理

```typescript
try {
  const data = await HttpRequest.get('/api/users');
  console.log('成功:', data);
} catch (error) {
  console.error('请求失败:', error);
  // 处理错误
}
```

### 6. 服务层封装

```typescript
// services/userService.ts
import { HttpRequest } from '@/utils/request';

export class UserService {
  static async getUsers(params?: any) {
    return HttpRequest.get('/api/users', params);
  }
  
  static async getUserById(id: string) {
    return HttpRequest.get(`/api/users/${id}`);
  }
  
  static async createUser(userData: any) {
    return HttpRequest.post('/api/users', userData);
  }
  
  static async updateUser(id: string, userData: any) {
    return HttpRequest.put(`/api/users/${id}`, userData);
  }
  
  static async deleteUser(id: string) {
    return HttpRequest.delete(`/api/users/${id}`);
  }
}
```

### 7. 在组件中使用

```typescript
// components/UserList.tsx
import { useState, useEffect } from 'react';
import { HttpRequest } from '@/utils/request';

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await HttpRequest.get('/api/users');
      setUsers(data);
    } catch (error) {
      console.error('加载用户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: any) => {
    try {
      const newUser = await HttpRequest.post('/api/users', userData);
      setUsers(prev => [...prev, newUser]);
    } catch (error) {
      console.error('创建用户失败:', error);
    }
  };

  return (
    <div>
      {loading ? '加载中...' : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 8. 实际应用场景

```typescript
// 根据环境或条件动态选择实现
import { HttpRequest, RequestType } from '@/utils/request';

async function fetchData(useFetch = false) {
  const requestType = useFetch ? RequestType.FETCH : RequestType.AXIOS;
  
  try {
    const data = await HttpRequest.get('/api/data', {}, { requestType });
    return data;
  } catch (error) {
    // 如果一种实现失败，可以尝试另一种
    const fallbackType = useFetch ? RequestType.AXIOS : RequestType.FETCH;
    console.log(`切换到 ${fallbackType} 实现`);
    return HttpRequest.get('/api/data', {}, { requestType: fallbackType });
  }
}

// 或者使用字符串版本（更简洁）
async function fetchDataWithString(useFetch = false) {
  const requestType = useFetch ? 'fetch' : 'axios';
  
  try {
    const data = await HttpRequest.get('/api/data', {}, { requestType });
    return data;
  } catch (error) {
    const fallbackType = useFetch ? 'axios' : 'fetch';
    console.log(`切换到 ${fallbackType} 实现`);
    return HttpRequest.get('/api/data', {}, { requestType: fallbackType });
  }
}

// 根据网络条件选择实现
async function adaptiveRequest(url: string) {
  const isOnline = navigator.onLine;
  const requestType = isOnline ? RequestType.AXIOS : RequestType.FETCH;
  
  return HttpRequest.get(url, {}, { requestType });
}

// 字符串版本
async function adaptiveRequestWithString(url: string) {
  const isOnline = navigator.onLine;
  const requestType = isOnline ? 'axios' : 'fetch';
  
  return HttpRequest.get(url, {}, { requestType });
}
```

### 9. 向后兼容使用

```typescript
// 原有的 API 仍然可用（作为 Legacy 导出）
import { LegacyHttpRequest, LegacyFetchRequest } from '@/utils/request';

const legacyData = await LegacyHttpRequest.get('/api/users');
const legacyFetchData = await LegacyFetchRequest.get('/api/users');
```

## 命名约定总结

- **HttpRequest**: 统一请求入口，默认使用 Axios 实现，支持动态切换
- **AxiosRequest**: 明确的 Axios 实现实例，支持动态切换
- **FetchRequest**: 明确的 Fetch 实现实例，支持动态切换
- **LegacyHttpRequest**: 原有的 Axios 请求实例（向后兼容）
- **LegacyFetchRequest**: 原有的 Fetch 请求实例（向后兼容）

## 核心特性

- ✅ **动态切换**: 在方法调用时通过 `requestType` 参数选择底层实现
- ✅ **无需新实例**: 同一个实例可以动态选择不同的实现方式
- ✅ **向后兼容**: 保持原有 API 的完全兼容性
- ✅ **类型安全**: 完整的 TypeScript 类型支持
- ✅ **统一接口**: 无论使用哪种实现，API 完全一致

推荐在项目中使用 `HttpRequest` 作为主要的请求入口，通过 `requestType` 参数灵活选择底层实现。
