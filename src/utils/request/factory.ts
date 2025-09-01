/**
 * 请求工厂函数
 * 提供便捷的请求实例创建方法
 */

import type { UnifiedRequestOptions } from './types';
import { UnifiedRequest } from './UnifiedRequest';
import { RequestType as RequestTypeValues } from './types';

/**
 * 创建 Axios 请求实例（默认使用 Axios，但支持动态切换）
 * @param options 配置选项
 */
export function createAxiosRequest(options?: Omit<UnifiedRequestOptions, 'type'>): UnifiedRequest {
  return new UnifiedRequest({
    ...options,
    type: RequestTypeValues.AXIOS,
  });
}

/**
 * 创建 Fetch 请求实例（默认使用 Fetch，但支持动态切换）
 * @param options 配置选项
 */
export function createFetchRequest(options?: Omit<UnifiedRequestOptions, 'type'>): UnifiedRequest {
  return new UnifiedRequest({
    ...options,
    type: RequestTypeValues.FETCH,
  });
}

/**
 * 创建请求实例（默认使用 Axios，支持动态切换）
 * @param options 配置选项
 */
export function createRequest(options?: UnifiedRequestOptions): UnifiedRequest {
  return new UnifiedRequest(options);
}

/**
 * 统一请求入口（默认使用 Axios，支持动态切换）
 */
export const HttpRequest = createRequest();

/**
 * Axios 请求实例（默认使用 Axios，支持动态切换）
 */
export const AxiosRequest = createAxiosRequest();

/**
 * Fetch 请求实例（默认使用 Fetch，支持动态切换）
 */
export const FetchRequest = createFetchRequest();

// 向后兼容的别名
export const axiosRequest = AxiosRequest;
export const fetchRequest = FetchRequest;
export const defaultRequest = HttpRequest;
