/**
 * fetch中对数据的中转处理
 */
/* 数据处理 */
import type { RequestOptions } from '@/types/axios';
import type { FetchTransform } from './types';
import { antdUtils } from '../../antdUtil';
import { joinTimestamp } from '../helper';
import { HttpCodeEnum, RequestEnum } from '@/enums/httpEnum';
import { setObjToUrlParams } from '../../utils';
import { isString } from '../../is';
import { encrypt } from '../../encrypt';
import type React from 'react';
import { useUserStore } from '@/stores/userStore';
// 移除对FetchRequest的依赖，使用自身的请求实例
import { commonService } from '@/services/common';
import { t } from 'i18next';

// 标记是否正在刷新token
let isRefreshing = false;
// 存储等待的请求
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(newToken: string) {
  for (const callback of refreshSubscribers) {
    callback(newToken);
  }
  refreshSubscribers = [];
}

function addSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}



/**
 * 创建transform实例，接受请求实例作为参数
 */
export const createTransform = (requestInstance: any): FetchTransform => ({
  /**
   * 处理响应数据
   * @param res
   * @param options
   */
  transformResponseHook: async (
    res: Response,
    options: RequestOptions,
  ) => {
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头
    if (isReturnNativeResponse) {
      return res;
    }
    
    // 检查响应状态
    if (!res.ok) {
      // 对于 HTTP 错误状态码，尝试解析错误信息
      let errorMessage = `HTTP Error: ${res.status}`;
      let errorCode = res.status;
      
      try {
        // 尝试解析错误响应体
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await res.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          if (errorData.code) {
            errorCode = errorData.code;
          }
        }
      } catch (parseError) {
        // 如果解析失败，使用默认错误信息
        console.warn('Failed to parse error response:', parseError);
      }
      
      // 获取请求URL信息
      const requestUrl = (res as any).config?.url || '未知接口';
      
      // 根据状态码显示不同的错误信息
      if (res.status === 404) {
        errorMessage = `${t('common.errorMsg.notFound') || '请求的资源不存在'}\n\n请求路径：${requestUrl}`;
      } else if (res.status === 403) {
        errorMessage = `${t('common.errorMsg.forbidden') || '没有权限访问该资源'}\n\n请求路径：${requestUrl}`;
      } else if (res.status === 500) {
        errorMessage = `${t('common.errorMsg.serverException') || '服务器内部错误'}\n\n请求路径：${requestUrl}`;
      } else if (res.status >= 400 && res.status < 500) {
        errorMessage = `${t('common.errorMsg.clientError') || '客户端请求错误'}\n\n请求路径：${requestUrl}`;
      } else if (res.status >= 500) {
        errorMessage = `${t('common.errorMsg.serverError') || '服务器错误'}\n\n请求路径：${requestUrl}`;
      }
      
      // 显示错误弹窗
      antdUtils.modal?.error({
        title: `${t('common.errorMsg.serverException')}（${t('common.errorMsg.statusCode')}：${errorCode}）`,
        content: errorMessage,
        okText: t('common.operation.confirm'),
      });
      
      throw new Error(errorMessage);
    }
    
    // 根据 Content-Type 判断响应格式
    const contentType = res.headers.get('content-type') || '';
    
    // 如果是 JSON 格式，进行业务逻辑处理
    if (contentType.includes('application/json')) {
      // 不进行任何处理，直接返回响应数据
      if (!isTransformResponse) {
        return await res.json();
      }
      
      // 错误的时候返回
      const data = await res.json();
      if (!data) {
        throw new Error(t('common.errorMsg.noData'));
      }
      const { code, data: rtn, message: msg } = data;
      // 系统默认200状态码为正常成功请求，可在枚举中配置自己的
      const hasSuccess =
        data && Reflect.has(data, 'code') && code === HttpCodeEnum.SUCCESS;
      if (hasSuccess) {
        if (msg && options.successMessageMode === 'success') {
          // 信息成功提示
          antdUtils.message?.success(msg);
        }
        return rtn;
      }
      if (options.errorMessageMode === 'modal') {
        antdUtils.modal?.error({
          title: `${t('common.errorMsg.serverException')},${t('common.errorMsg.statusCode')}(${code})`,
          content: msg,
          okText: t('common.operation.confirm'),
        });
      } else if (options.errorMessageMode === 'message') {
        antdUtils.message?.error(msg);
      }
      throw new Error(msg || t('common.errorMsg.requestFailed'));
    }
    
    // 非 JSON 格式，根据 Content-Type 返回相应格式
    if (contentType.includes('text/')) {
      return await res.text();
    } else if (contentType.includes('application/octet-stream') || contentType.includes('application/pdf')) {
      return await res.blob();
    } else {
      // 默认尝试 JSON，如果失败则返回文本
      try {
        return await res.json();
      } catch {
        return await res.text();
      }
    }
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      joinTime = true,
      urlPrefix,
    } = options;
    
    let url = (config as any).url || '';
    
    if (joinPrefix) {
      url = `${urlPrefix}${url}`;
    }
    if (apiUrl && isString(apiUrl)) {
      url = `${apiUrl}${url}`;
    }
    
    const params = (config as any).params || {};
    const data = (config as any).data || false;
    const method = config.method?.toUpperCase();
    
    if (
      method === RequestEnum.GET ||
      method === RequestEnum.DELETE
    ) {
      if (!isString(params)) {
        // 给get请求加上事件戳参数，避免从缓存中拿数据
        const searchParams = new URLSearchParams();
        Object.assign(params || {}, joinTimestamp(joinTime, false));
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        url += (url.includes('?') ? '&' : '?') + searchParams.toString();
      } else {
        // 兼容restful风格
        url = `${url + params}${joinTimestamp(joinTime, true)}`;
      }
    } else {
      if (!isString(params)) {
        if (
          Reflect.has(config, 'data') &&
          (config as any).data &&
          Object.keys((config as any).data).length > 0
        ) {
          (config as any).data = data;
          (config as any).params = params;
        } else {
          // 非get请求如果没有提供data，则将params视为data
          (config as any).data = params;
          (config as any).params = undefined;
        }
        if (joinParamsToUrl) {
          url = setObjToUrlParams(
            url,
            Object.assign({}, (config as any).params, (config as any).data),
          );
        }
      } else {
        // 兼容restful风格
        url = url + params;
        (config as any).params = undefined;
      }
    }
    
    (config as any).url = url;
    return config;
  },

  /**
   * 请求拦截器处理（主要用于处理如token的传入，授权信息等，或请求头里的一些特殊参数）
   * @param config
   * @param options
   */
  requestInterceptors: (config, options) => {
    const userStore = useUserStore.getState();
    const token = options?.requestOptions?.token || userStore.token;
    const cpt = options?.requestOptions?.encrypt;
    
    // 创建新的headers对象
    const headers = new Headers(config.headers);
    
    // 进行数据加密
    if ((config as any).body && cpt === 1) {
      // 判定json数据需要转为json字符串才能加密
      if (
        typeof (config as any).body === 'object' &&
        (headers.get('Content-Type') === 'application/json' ||
          headers.get('Content-Type') === 'application/json;charset=UTF-8')
      ) {
        (config as any).body = JSON.stringify((config as any).body);
      }
      const result = encrypt((config as any).body);
      (config as any).body = result.data;
      // 将秘钥放到请求头里面
      if (result.key) {
        headers.set('X-Encrypted-Key', result.key);
      }
    }
    // 将加密配置放到请求头里面
    headers.set('X-Encrypted', String(cpt));
    // 处理token
    headers.set('Authorization', `Bearer ${token}`);
    
    return {
      ...config,
      headers,
    };
  },

  /**
   * 请求失败后处理（如502网关错误）
   *
   * @param error 错误信息
   * @param options 请求配置
   */
  requestCatchHook: (error: Error) => {
    let errMessage = '';
    if (error.message.includes('502')) {
      errMessage = t('common.errorMsg.requestFailed');
    } else if (error.message.includes('500')) {
      errMessage = `${t('common.errorMsg.serverException')},${t('common.errorMsg.retry')}`;
    }
    if (errMessage) {
      antdUtils.modal?.error({
        title: `${t('common.errorMsg.serverException')},${t('common.errorMsg.statusCode')}(500)`,
        content: errMessage,
        okText: t('common.operation.confirm'),
      });
    }
    return Promise.reject(error);
  },

  /**
   * 响应拦截器处理
   * @param res
   */
  responseInterceptors: async (res: Response) => {
    const userStore = useUserStore.getState();
    const config = (res as any).config;
    
    // 检查响应状态 - fetch 中 401 等状态码实际上 res.ok = true
    // 只有在网络错误或 CORS 错误时 res.ok 才为 false
    if (!res.ok) {
      // 网络错误或 CORS 错误，直接返回
      return res;
    }
    
    // 检查 Content-Type 是否为 JSON
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // 非 JSON 响应，直接返回
      return res;
    }
    
    // 解析 JSON 响应获取业务状态码
    let result: any = {};
    try {
      // 克隆响应对象，避免多次读取 body
      const clonedResponse = res.clone();
      result = await clonedResponse.json();
    } catch (parseError) {
      // 如果解析失败，直接返回原响应
      console.warn('Failed to parse response as JSON:', parseError);
      return res;
    }
    
    const { code: responseCode } = result;
    
    // 判断是否跳过请求
    if (
      config?.requestOptions?.skipAuthInterceptor &&
      responseCode === HttpCodeEnum.RC401
    ) {
      antdUtils.modal?.confirm({
        title: t('login.loginValid'),
        content: t('login.retryLogin'),
        onOk() {
          userStore.logout();
          window.location.href = '/login';
        },
        okText: t('common.operation.confirm'),
      });
      throw new Error(t('login.loginValid'));
    }
    
    // 判断业务状态码是否为401(即token失效),添加_retry属性防止重复刷新token
    if (responseCode === HttpCodeEnum.RC401 && !config?._retry) {
      config._retry = true;
      
      // 判断是否正在刷新token
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // 调用刷新token的接口
          const newToken = await commonService.refreshToken(
            userStore.refreshToken,
          );
          if (!newToken) {
            throw new Error('refresh token failed');
          }
          // 更新token到store
          userStore.setToken(newToken);
          // 执行等待的请求
          onTokenRefreshed(newToken);
          // 重新发起原始请求
          const response = await requestInstance.request(
            { ...config },
            { token: newToken, isReturnNativeResponse: true },
          );
          return response;
        } catch (refreshError) {
          // 刷新 token 失败，跳转登录页
          antdUtils.modal?.confirm({
            title: t('login.loginValid'),
            content: t('login.retryLogin'),
            onOk() {
              userStore.logout();
              window.location.href = '/login';
            },
            okText: t('common.operation.confirm'),
          });
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      } else {
        // 正在刷新token，将请求加入队列
        return new Promise((resolve, reject) => {
          addSubscriber((token: string) => {
            // 重新发起原始请求
            requestInstance.request(
              { ...config },
              { token: token, isReturnNativeResponse: true },
            )
              .then(resolve)
              .catch(reject);
          });
        });
      }
    }
    
    // 如果是401错误且已经重试过，则抛出错误
    if (responseCode === HttpCodeEnum.RC401) {
      throw new Error(t('login.loginValid'));
    }
    
    return res;
  },

  /**
   * 响应错误处理(这种是针对后端服务有响应的，比如404之类的)，这里需要放过401的请求，让其走到上面的token续期操作里面
   * @param error
   */
  responseInterceptorsCatch: (error: any) => {
    const err: string = error?.toString?.() ?? '';
    const result = error.response?.data ?? {};
    const { code: responseCode, message: responseMessage } = result;

    const { code, message } = error || {};
    let errMessage: string | React.ReactNode = '';
    if (responseCode === HttpCodeEnum.RC404 && responseMessage) {
      errMessage = (
        <>
          <div>错误信息：{responseMessage}</div>
          <div>请求路径：{error.config?.url}</div>
        </>
      );
    } else if (code === 'ECONNABORTED' && message?.indexOf('timeout') !== -1) {
      errMessage = t('common.errorMsg.requestTimeout');
    } else if (err?.includes('Network Error') || err?.includes('Failed to fetch')) {
      errMessage = t('common.errorMsg.networkException');
    } else if (responseCode !== HttpCodeEnum.RC401 && responseMessage) {
      errMessage = responseMessage;
    }

    if (errMessage) {
      antdUtils.modal?.error({
        title: `${t('common.errorMsg.serverException')}（${t('common.errorMsg.statusCode')}：${responseCode || code}）`,
        content: errMessage,
        okText: t('common.operation.confirm'),
      });
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
});

// 为了向后兼容，导出一个默认的transform实例（需要在使用时传入请求实例）
export const transform: FetchTransform = createTransform(null as any);