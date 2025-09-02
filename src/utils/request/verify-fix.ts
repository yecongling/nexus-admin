/**
 * 验证修复效果 - 检查axios和fetch实例是否使用正确的transform
 */

import { HttpRequest } from './index';

export function verifyTransformFix() {
  console.log('=== 验证Transform修复效果 ===');
  
  // 获取实例
  const axiosInstance = HttpRequest.getAxiosInstance();
  const fetchInstance = HttpRequest.getFetchInstance();
  
  if (axiosInstance && fetchInstance) {
    // 检查transform是否不同
    const axiosTransform = (axiosInstance as any).options?.transform;
    const fetchTransform = (fetchInstance as any).options?.transform;
    
    console.log('Axios transform存在:', !!axiosTransform);
    console.log('Fetch transform存在:', !!fetchTransform);
    console.log('Transform实例不同:', axiosTransform !== fetchTransform);
    
    // 检查transform方法
    if (axiosTransform && fetchTransform) {
      console.log('Axios transform方法:', Object.keys(axiosTransform));
      console.log('Fetch transform方法:', Object.keys(fetchTransform));
      
      // 检查transformResponseHook是否存在
      console.log('Axios有transformResponseHook:', !!axiosTransform.transformResponseHook);
      console.log('Fetch有transformResponseHook:', !!fetchTransform.transformResponseHook);
    }
  }
  
  return {
    axiosInstance: !!axiosInstance,
    fetchInstance: !!fetchInstance,
    transformsDifferent: axiosInstance && fetchInstance && 
      (axiosInstance as any).options?.transform !== (fetchInstance as any).options?.transform
  };
}

// 测试函数
export async function testRequestTypes() {
  console.log('=== 测试请求类型 ===');
  
  try {
    // 测试默认请求（应该是Axios）
    console.log('测试默认请求...');
    await HttpRequest.get({
      url: '/api/test',
      params: { type: 'default' }
    });
    
    // 测试明确指定Axios
    console.log('测试Axios请求...');
    await HttpRequest.get({
      url: '/api/test',
      params: { type: 'axios' },
      requestType: 'axios' as any
    });
    
    // 测试明确指定Fetch
    console.log('测试Fetch请求...');
    await HttpRequest.get({
      url: '/api/test',
      params: { type: 'fetch' },
      requestType: 'fetch' as any
    });
    
    console.log('所有测试完成');
  } catch (error) {
    console.log('测试过程中出现错误（这是正常的，因为API可能不存在）:', error);
  }
}
