import { cloneDeep } from 'lodash-es';
import type { RequestOptions } from '@/types/axios';
import { isFunction } from '@/utils/is';
import type { CreateFetchOptions } from './types';

/**
 * Fetch请求封装
 */
export class RFetch {
  private readonly options: CreateFetchOptions;

  constructor(options: CreateFetchOptions) {
    this.options = options;
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  /**
   * 设置transform
   * @param transform 新的transform实例
   */
  setTransform(transform: any) {
    this.options.transform = transform;
  }

  /**
   * 创建AbortController用于取消请求
   */
  private createAbortController(timeout?: number): AbortController {
    const controller = new AbortController();

    if (timeout && timeout > 0) {
      setTimeout(() => {
        controller.abort();
      }, timeout);
    }

    return controller;
  }

  /**
   * 处理请求体数据
   */
  private processRequestBody(data: any, headers: Headers): any {
    const contentType = headers.get('Content-Type');

    if (data === null || data === undefined) {
      return undefined;
    }

    if (contentType?.includes('application/json')) {
      return JSON.stringify(data);
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      return new URLSearchParams(data).toString();
    } else if (data instanceof FormData) {
      return data;
    } else if (typeof data === 'string') {
      return data;
    } else {
      return JSON.stringify(data);
    }
  }

  /**
   * 封装请求
   * @param config 请求配置
   * @param options 请求项
   */
  async request<T = any>(config: CreateFetchOptions, options?: RequestOptions): Promise<T> {
    let conf: CreateFetchOptions = cloneDeep(config);
    const transform = this.getTransform();
    const { requestOptions } = this.options;
    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    // 请求前的数据处理
    const { beforeRequestHook, requestCatchHook, transformResponseHook } = transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;

    try {
      // 创建AbortController
      const controller = this.createAbortController((this.options as any).timeout);

      // 处理请求头 - 合并实例默认headers和请求配置headers
      const defaultHeaders = this.options.headers || {};
      const requestHeaders = conf.headers || {};
      const mergedHeaders = { ...defaultHeaders, ...requestHeaders };
      const headers = new Headers(mergedHeaders);

      // 处理请求体
      const body = this.processRequestBody((conf as any).data, headers);

      // 构建fetch配置
      const fetchConfig: RequestInit = {
        method: conf.method || 'GET',
        headers,
        signal: controller.signal,
        ...(body && { body }),
      };

      // 请求拦截器处理
      if (transform?.requestInterceptors && isFunction(transform.requestInterceptors)) {
        const processedConfig = transform.requestInterceptors(fetchConfig, conf);
        Object.assign(fetchConfig, processedConfig);
      }

      // 发起请求
      const response = await fetch((conf as any).url, fetchConfig);

      // 将config附加到response对象上，用于拦截器处理
      (response as any).config = conf;

      // 响应拦截器处理
      let processedResponse = response;
      if (transform?.responseInterceptors && isFunction(transform.responseInterceptors)) {
        processedResponse = await transform.responseInterceptors(response);
      }

      // 响应数据转换
      if (transformResponseHook && isFunction(transformResponseHook)) {
        try {
          const ret = await transformResponseHook(processedResponse, opt);
          return ret;
        } catch (err) {
          throw err || new Error('请求错误！');
        }
      }

      // 处理特殊响应类型
      const responseType = (conf as any).responseType;
      if (responseType === 'blob') {
        return (await processedResponse.blob()) as unknown as T;
      } else if (responseType === 'arraybuffer') {
        return (await processedResponse.arrayBuffer()) as unknown as T;
      } else if (responseType === 'text') {
        return (await processedResponse.text()) as unknown as T;
      } else if (responseType === 'json') {
        return (await processedResponse.json()) as unknown as T;
      }

      return processedResponse as unknown as T;
    } catch (error) {
      // 请求错误处理
      if (requestCatchHook && isFunction(requestCatchHook)) {
        throw await requestCatchHook(error as Error, opt);
      }

      // 响应错误拦截器处理
      if (transform?.responseInterceptorsCatch && isFunction(transform.responseInterceptorsCatch)) {
        transform.responseInterceptorsCatch(error as Error);
      }

      throw error;
    }
  }
}
