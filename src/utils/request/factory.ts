/**
 * 请求工厂函数
 * 提供便捷的请求实例创建方法
 */

import type { UnifiedRequestOptions } from './types';
import { UnifiedRequest } from './UnifiedRequest';

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
