/**
 * 统一请求封装入口文件
 * 提供 Axios 和 Fetch 的统一接口
 */

// 导出统一请求相关
export { UnifiedRequest } from './UnifiedRequest';
export { 
  createAxiosRequest, 
  createFetchRequest, 
  createRequest,
  HttpRequest,        // 统一请求入口（默认 Axios）
  AxiosRequest,       // Axios 请求实例
  FetchRequest,       // Fetch 请求实例
  // 向后兼容的别名
  axiosRequest,
  fetchRequest,
  defaultRequest 
} from './factory';
export type { 
  UnifiedRequestConfig, 
  UnifiedRequestOptions, 
  IUnifiedRequest,
  ExtendedRequestOptions
} from './types';
export { RequestType } from './types';

// 导出 Axios 相关（向后兼容）
export { HttpRequest as LegacyHttpRequest, RAxios, createAxios } from './axios';
export type { CreateAxiosOptions } from './axios';

// 导出 Fetch 相关（向后兼容）
export { FetchRequest as LegacyFetchRequest, RFetch, createFetch } from './fetch';
export type { CreateFetchOptions } from './fetch';

// 导出工具函数
export { joinTimestamp } from './helper';