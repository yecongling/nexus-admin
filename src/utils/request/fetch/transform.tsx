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
import { FetchRequest } from '.';
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
 * 定义一些拦截器的具体实现
 */
export const transform: FetchTransform = {
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
    // 不进行任何处理，直接返回响应数据
    if (!isTransformResponse) {
      return await res.json();
    }
    
    // 检查响应状态
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
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
    if ((config as any).data && cpt === 1) {
      // 判定json数据需要转为json字符串才能加密
      if (
        typeof (config as any).data === 'object' &&
        (headers.get('Content-Type') === 'application/json' ||
          headers.get('Content-Type') === 'application/json;charset=UTF-8')
      ) {
        (config as any).data = JSON.stringify((config as any).data);
      }
      const result = encrypt((config as any).data);
      (config as any).data = result.data;
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
    
    // 检查响应状态
    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
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
        return Promise.reject(t('login.loginValid'));
      }
      
      // 判断responseCode是否为401(即token失效),添加_retry属性防止重复刷新token
      if (
        responseCode === HttpCodeEnum.RC401 &&
        !config?._retry
      ) {
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
            const response = await FetchRequest.request(
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
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // 正在刷新token，将请求加入队列
          return new Promise((resolve, reject) => {
            addSubscriber((token: string) => {
              // 重新发起原始请求
              FetchRequest.request(
                { ...config },
                { token: token, isReturnNativeResponse: true },
              )
                .then(resolve)
                .catch(reject);
            });
          });
        }
      }
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
};