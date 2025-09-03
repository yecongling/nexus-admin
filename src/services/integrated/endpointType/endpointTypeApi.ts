/**
 * 枚举端点相关的请求API
 */

import { HttpRequest } from '@/utils/request';

const Api = {
  /**
   * 获取所有端点配置列表
   */
  queryEndpointConfigType: '/engine/endpointConfig/queryEndpointConfigType',

  /**
   * 新增端点类型
   */
  addEndpointType: '/engine/endpointConfig/addEndpointType',

  /**
   * 修改端点类型
   */
  updateEndpointType: '/engine/endpointConfig/updateEndpointType',

  /**
   * 删除端点类型
   */
  deleteEndpointType: '/engine/endpointConfig/deleteEndpointType',
};

/**
 * 获取所有端点配置列表
 * @param params
 */
export const queryEndpointConfigType = (params?: string) => {
  return HttpRequest.get({
    url: Api.queryEndpointConfigType,
    params: { name: params },
  });
};

/**
 * 新增端点类型
 * @param params 端点数据
 * @returns
 */
export const addEndpointType = (params: Record<string, any>) => {
  return HttpRequest.post({
    url: Api.addEndpointType,
    data: params,
  });
};

/**
 * 修改端点类型
 * @param params 端点数据
 * @returns
 */
export const updateEndpointType = (params: Record<string, any>) => {
  return HttpRequest.post({
    url: Api.updateEndpointType,
    data: params,
  });
};

/**
 * 删除端点类型
 * @param typeId 端点类型ID
 * @returns
 */
export const deleteEndpointType = (typeId: string) => {
  return HttpRequest.delete({
    url: Api.deleteEndpointType,
    params: { id: typeId },
  });
};
