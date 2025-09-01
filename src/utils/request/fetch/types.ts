/**
 * Fetch 封装的类型定义
 */

import type { RequestOptions } from '@/types/axios';

// 扩展 RequestInit 接口以支持额外的配置选项
export interface CreateFetchOptions extends RequestInit {
  transform?: FetchTransform;
  requestOptions?: RequestOptions;
  // 标记是否正在重试获取访问token
  _retry?: boolean;
  url?: string;
  timeout?: number;
  data?: any;
  params?: any;
}

// Fetch 转换器接口
export interface FetchTransform {
  /**
   * 请求前处理配置
   */
  beforeRequestHook?: (
    config: RequestInit,
    options: RequestOptions,
  ) => RequestInit;

  /**
   * 响应数据转换
   */
  transformResponseHook?: (
    res: Response,
    options: RequestOptions,
  ) => any;

  /**
   * 请求失败处理
   */
  requestCatchHook?: (
    e: Error,
    options: RequestOptions,
  ) => Promise<any>;

  /**
   * 请求之前的拦截器
   */
  requestInterceptors?: (
    config: RequestInit,
    options: CreateFetchOptions,
  ) => RequestInit;

  /**
   * 请求之后的拦截器
   */
  responseInterceptors?: (res: Response) => any;

  /**
   * 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: Error) => void;
}

// 加密结果类型
export interface EncryptResult {
  data: string;
  key: string | false;
}

// 扩展 Response 接口以支持附加的配置信息
export interface ExtendedResponse extends Response {
  config?: CreateFetchOptions;
}
