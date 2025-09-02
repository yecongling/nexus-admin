/**
 * 统一请求封装类
 * 支持通过参数选择使用 Axios 或 Fetch 实现
 */

import type { AxiosRequestConfig } from 'axios';
import type { CreateAxiosOptions } from './axios/transform';
import type { CreateFetchOptions } from './fetch/types';
import type {
  UnifiedRequestConfig,
  UnifiedRequestOptions,
  IUnifiedRequest,
  RequestType,
  ExtendedRequestOptions,
} from './types';
import { RequestType as RequestTypeValues } from './types';
import { RAxios } from './axios/Axios';
import { RFetch } from './fetch/Fetch';
import { createTransform as createAxiosTransform } from './axios/transform';
import { createTransform as createFetchTransform } from './fetch/transform';
import { deepMerge } from '../utils';
import { cloneDeep } from 'lodash-es';
import { ContentTypeEnum } from '@/enums/httpEnum';

/**
 * 统一请求类
 * 提供统一的 API 接口，内部根据配置选择使用 Axios 或 Fetch
 */
export class UnifiedRequest implements IUnifiedRequest {
  private axiosInstance?: RAxios;
  private fetchInstance?: RFetch;
  private readonly defaultRequestType: RequestType;
  private readonly baseConfig: Partial<UnifiedRequestConfig>;

  constructor(options: UnifiedRequestOptions = {}) {
    this.defaultRequestType = options.type || RequestTypeValues.AXIOS;
    this.baseConfig = options.config || {};

    // 初始化所有实例，支持动态切换
    this.initializeInstances();
  }

  /**
   * 初始化所有请求实例
   * @private
   */
  private initializeInstances(): void {
    const defaultConfig = {
      timeout: 0,
      headers: { 'Content-Type': ContentTypeEnum.JSON },
      requestOptions: {
        joinPrefix: true,
        isReturnNativeResponse: false,
        isTransformResponse: true,
        joinParamsToUrl: false,
        formatDate: true,
        errorMessageMode: 'modal' as const,
        successMessageMode: 'success' as const,
        apiUrl: '/api',
        urlPrefix: '',
        joinTime: false,
        ignoreCancelToken: true,
        encrypt: import.meta.env.MODE === 'development' ? 0 : 1,
      },
    };

    // 初始化 Axios 实例 - 使用深拷贝避免对象引用问题
    const axiosConfig: CreateAxiosOptions = deepMerge(cloneDeep(defaultConfig), this.baseConfig);
    this.axiosInstance = new RAxios(axiosConfig);
    
    // 初始化 Fetch 实例 - 使用深拷贝避免对象引用问题
    const fetchConfig: CreateFetchOptions = deepMerge(cloneDeep(defaultConfig), this.baseConfig);
    this.fetchInstance = new RFetch(fetchConfig);
    // 分别设置transform，确保每个实例使用正确的transform
    this.axiosInstance.setTransform(createAxiosTransform(this.axiosInstance));
    this.fetchInstance.setTransform(createFetchTransform(this.fetchInstance));
  }

  /**
   * 根据请求类型获取对应的请求实例
   * @param requestType 请求类型
   * @private
   */
  private getRequestInstance(requestType?: RequestType): RAxios | RFetch {
    const type = requestType || this.defaultRequestType;

    if (type === RequestTypeValues.AXIOS) {
      if (!this.axiosInstance) {
        throw new Error('Axios 实例未初始化');
      }
      return this.axiosInstance;
    } else if (type === RequestTypeValues.FETCH) {
      if (!this.fetchInstance) {
        throw new Error('Fetch 实例未初始化');
      }
      return this.fetchInstance;
    } else {
      throw new Error(`不支持的请求类型: ${type}`);
    }
  }

  /**
   * 将统一配置转换为 Axios 配置
   * @param config 统一配置
   * @private
   */
  private convertToAxiosConfig(config: UnifiedRequestConfig): AxiosRequestConfig {
    const axiosConfig: AxiosRequestConfig = {
      url: config.url,
      method: config.method?.toLowerCase() as any,
      headers: config.headers,
      timeout: config.timeout,
      responseType: config.responseType as any,
    };

    // 处理参数和数据
    if (config.method === 'GET' || config.method === 'DELETE') {
      axiosConfig.params = config.params || config.data;
    } else {
      axiosConfig.data = config.data;
      axiosConfig.params = config.params;
    }

    return axiosConfig;
  }

  /**
   * 将统一配置转换为 Fetch 配置
   * @param config 统一配置
   * @private
   */
  private convertToFetchConfig(config: UnifiedRequestConfig): CreateFetchOptions {
    const fetchConfig: CreateFetchOptions = {
      url: config.url,
      method: config.method,
      headers: config.headers,
      timeout: config.timeout,
    };

    // 处理参数和数据
    if (config.method === 'GET' || config.method === 'DELETE') {
      (fetchConfig as any).params = config.params || config.data;
    } else {
      (fetchConfig as any).data = config.data;
      (fetchConfig as any).params = config.params;
    }

    // 将 responseType 传递给 Fetch 配置，用于响应处理
    (fetchConfig as any).responseType = config.responseType;

    return fetchConfig;
  }

  /**
   * 通用请求方法
   * @param config 请求配置
   * @param options 请求选项
   */
  async request<T = any>(config: UnifiedRequestConfig, options?: ExtendedRequestOptions): Promise<T> {
    // 优先使用 config 中的 requestType，然后是 options 中的，最后是默认的
    const requestType = config.requestType || options?.requestType || this.defaultRequestType;
    const requestInstance = this.getRequestInstance(requestType);

    if (requestType === RequestTypeValues.AXIOS) {
      const axiosConfig = this.convertToAxiosConfig(config);
      return (requestInstance as RAxios).request<T>(axiosConfig, options);
    } else if (requestType === RequestTypeValues.FETCH) {
      const fetchConfig = this.convertToFetchConfig(config);
      return (requestInstance as RFetch).request<T>(fetchConfig, options);
    } else {
      throw new Error(`不支持的请求类型: ${requestType}`);
    }
  }

  /**
   * GET 请求
   * @param url 请求地址
   * @param params 查询参数
   * @param options 请求选项
   */
  async get<T = any>(config: UnifiedRequestConfig, options?: ExtendedRequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' }, options);
  }

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param options 请求选项
   */
  async post<T = any>(config: UnifiedRequestConfig, options?: ExtendedRequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' }, options);
  }

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param options 请求选项
   */
  async put<T = any>(config: UnifiedRequestConfig, options?: ExtendedRequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' }, options);
  }

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param params 查询参数
   * @param options 请求选项
   */
  async delete<T = any>(config: UnifiedRequestConfig, options?: ExtendedRequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' }, options);
  }

  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param options 请求选项
   */
  async patch<T = any>(config: UnifiedRequestConfig, options?: ExtendedRequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' }, options);
  }

  /**
   * 获取默认的请求类型
   */
  getDefaultRequestType(): RequestType {
    return this.defaultRequestType;
  }

  /**
   * 获取 Axios 实例（仅在使用 Axios 时可用）
   */
  getAxiosInstance(): RAxios | undefined {
    return this.axiosInstance;
  }

  /**
   * 获取 Fetch 实例（仅在使用 Fetch 时可用）
   */
  getFetchInstance(): RFetch | undefined {
    return this.fetchInstance;
  }
}
