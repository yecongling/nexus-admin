/**
 * 统一请求封装入口文件
 * 提供统一的请求接口，支持 Axios 和 Fetch 两种实现
 */

// 导出统一请求相关
export { UnifiedRequest } from './UnifiedRequest';
export {
  createRequest,
  HttpRequest, // 统一请求入口（默认 Axios）
} from './factory';

// 导出类型定义
export type {
  UnifiedRequestConfig,
  UnifiedRequestOptions,
  IUnifiedRequest,
  ExtendedRequestOptions,
} from './types';
export { RequestType } from './types';

// 导出工具函数
export { joinTimestamp } from './helper';
