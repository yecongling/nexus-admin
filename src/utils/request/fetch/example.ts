/**
 * Fetch 封装使用示例
 * 这个文件展示了如何使用 fetch 封装进行各种类型的请求
 */

import { FetchRequest } from './index';

// 示例：获取用户列表
export async function getUserList() {
  try {
    const users = await FetchRequest.get({
      url: '/api/users',
      params: {
        page: 1,
        size: 10,
        keyword: 'test'
      }
    });
    console.log('用户列表:', users);
    return users;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
}

// 示例：创建用户
export async function createUser(userData: any) {
  try {
    const result = await FetchRequest.post({
      url: '/api/users',
      data: userData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('创建用户成功:', result);
    return result;
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
}

// 示例：更新用户信息
export async function updateUser(userId: string, userData: any) {
  try {
    const result = await FetchRequest.put({
      url: `/api/users/${userId}`,
      data: userData
    });
    console.log('更新用户成功:', result);
    return result;
  } catch (error) {
    console.error('更新用户失败:', error);
    throw error;
  }
}

// 示例：删除用户
export async function deleteUser(userId: string) {
  try {
    const result = await FetchRequest.delete({
      url: `/api/users/${userId}`
    });
    console.log('删除用户成功:', result);
    return result;
  } catch (error) {
    console.error('删除用户失败:', error);
    throw error;
  }
}

// 示例：上传文件
export async function uploadFile(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const result = await FetchRequest.post({
      url: '/api/upload',
      data: formData,
      headers: {
        // 不设置 Content-Type，让浏览器自动设置
      }
    });
    console.log('文件上传成功:', result);
    return result;
  } catch (error) {
    console.error('文件上传失败:', error);
    throw error;
  }
}

// 示例：带自定义配置的请求
export async function customRequest() {
  try {
    const result = await FetchRequest.post({
      url: '/api/custom',
      data: { message: 'Hello World' }
    }, {
      // 自定义请求选项
      successMessageMode: 'none', // 不显示成功消息
      errorMessageMode: 'message', // 使用 message 模式显示错误
      encrypt: 0, // 不加密数据
      isReturnNativeResponse: false, // 返回处理后的数据
      joinTime: true, // 添加时间戳
    });
    console.log('自定义请求成功:', result);
    return result;
  } catch (error) {
    console.error('自定义请求失败:', error);
    throw error;
  }
}

// 示例：处理需要跳过认证拦截器的请求
export async function publicRequest() {
  try {
    const result = await FetchRequest.get({
      url: '/api/public/data'
    }, {
      skipAuthInterceptor: true // 跳过认证拦截器
    });
    console.log('公开请求成功:', result);
    return result;
  } catch (error) {
    console.error('公开请求失败:', error);
    throw error;
  }
}
