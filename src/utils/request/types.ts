/**
 * 统一请求封装类型定义
 */

import type { RequestOptions } from '@/types/axios';

/**
/**
 * 请求实现方式类型
 */
export type RequestType = 'axios' | 'fetch';

/**
 * 请求实现方式常量
 */
export const RequestType = {
  /** 使用 Axios 实现 */
  AXIOS: 'axios' as const,
  /** 使用 Fetch 实现 */
  FETCH: 'fetch' as const,
} as const;

/**
 * 统一的请求配置接口
 * 兼容 Axios 和 Fetch 的配置选项
 */
export interface UnifiedRequestConfig {
  /** 请求 URL */
  url: string;
  /** 请求方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求参数（GET 请求时作为查询参数，POST 等请求时作为请求体） */
  data?: any;
  /** 查询参数（仅用于 GET 请求） */
  params?: Record<string, any>;
  /** 请求超时时间（毫秒） */
  timeout?: number;
  /** 响应类型 */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'document' | 'stream';
  /** 请求选项 */
  requestOptions?: RequestOptions;
  /** 请求实现类型（可选，用于动态选择底层实现） */
  requestType?: RequestType;
}

/**
 * 统一请求类配置选项
 */
export interface UnifiedRequestOptions {
  /** 请求实现方式，默认为 axios */
  type?: RequestType;
  /** 基础配置 */
  config?: Partial<UnifiedRequestConfig>;
}

/**
 * 请求选项扩展接口，支持动态选择实现
 */
export interface ExtendedRequestOptions extends RequestOptions {
  /** 请求实现类型（可选，用于动态选择底层实现） */
  requestType?: RequestType;
}

/**
 * 统一请求类接口
 */
export interface IUnifiedRequest {
  /**
   * 通用请求方法
   * @param config 请求配置
   * @param options 请求选项
   */
  request<T = any>(config: UnifiedRequestConfig, options?: ExtendedRequestOptions): Promise<T>;

  /**
   * GET 请求
   * @param url 请求地址
   * @param params 查询参数
   * @param options 请求选项
   */
  get<T = any>(
    { url, params }: { url: string; params?: Record<string, any> },
    options?: ExtendedRequestOptions,
  ): Promise<T>;

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param options 请求选项
   */
  post<T = any>({ url, data }: { url: string; data?: any }, options?: ExtendedRequestOptions): Promise<T>;

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param options 请求选项
   */
  put<T = any>({ url, data }: { url: string; data?: any }, options?: ExtendedRequestOptions): Promise<T>;

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param params 查询参数
   * @param options 请求选项
   */
  delete<T = any>(
    { url, params }: { url: string; params?: Record<string, any> },
    options?: ExtendedRequestOptions,
  ): Promise<T>;

  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param options 请求选项
   */
  patch<T = any>({ url, data }: { url: string; data?: any }, options?: ExtendedRequestOptions): Promise<T>;
}
