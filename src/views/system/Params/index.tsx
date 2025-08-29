import type React from 'react';
import { useState, useCallback } from 'react';
import { App, Card, Modal } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SearchForm from './components/SearchForm';
import TableActionButtons from './components/TableActionButtons';
import ParamTable from './components/ParamTable';
import ParamModal from './components/ParamModal';
import { sysParamService } from './api';
import type { SysParam, SysParamSearchParams, SysParamFormData } from './types';
import { PAGINATION_CONFIG } from './config';
import './styles/params.module.scss';

const { confirm } = Modal;

/**
 * 系统参数管理
 */
const Params: React.FC = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  // 状态管理
  const [searchParams, setSearchParams] = useState<SysParamSearchParams>({
    pageNum: 1,
    pageSize: 10,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [currentRecord, setCurrentRecord] = useState<SysParam | undefined>();
  const [modalLoading, setModalLoading] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  // 查询参数列表
  const {
    data: result,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['sys_params', searchParams],
    queryFn: () => sysParamService.queryParams(searchParams),
  });

  // 数据
  const total = result?.total || 0;

  // 新增参数
  const createMutation = useMutation({
    mutationFn: (data: SysParamFormData) => sysParamService.createParam(data),
    onSuccess: () => {
      message.success('新增参数成功');
      setModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['sys_params'] });
    },
    onError: (error: any) => {
      message.error(`新增参数失败: ${error.message || '未知错误'}`);
    },
  });

  // 更新参数
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SysParamFormData }) => sysParamService.updateParam(id, data),
    onSuccess: () => {
      message.success('更新参数成功');
      setModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['sys_params'] });
    },
    onError: (error: any) => {
      message.error(`更新参数失败: ${error.message || '未知错误'}`);
    },
  });

  // 删除参数
  const deleteMutation = useMutation({
    mutationFn: (id: number) => sysParamService.deleteParam(id),
    onSuccess: () => {
      message.success('删除参数成功');
      queryClient.invalidateQueries({ queryKey: ['sys_params'] });
    },
    onError: (error: any) => {
      message.error(`删除参数失败: ${error.message || '未知错误'}`);
    },
  });

  // 批量删除参数
  const batchDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => sysParamService.batchDeleteParams(ids),
    onSuccess: () => {
      message.success('批量删除参数成功');
      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ['sys_params'] });
    },
    onError: (error: any) => {
      message.error(`批量删除参数失败: ${error.message || '未知错误'}`);
    },
  });

  // 处理搜索
  const handleSearch = useCallback((values: SysParamSearchParams) => {
    setSearchParams((prev) => ({
      ...prev,
      ...values,
      pageNum: 1, // 重置到第一页
    }));
  }, []);

  // 处理重置
  const handleReset = useCallback(() => {
    setSearchParams({
      pageNum: 1,
      pageSize: 10,
    });
  }, []);

  // 处理新增
  const handleAdd = useCallback(() => {
    setModalTitle('新增参数');
    setCurrentRecord(undefined);
    setModalVisible(true);
  }, []);

  // 处理编辑
  const handleEdit = useCallback((record: SysParam) => {
    setModalTitle('编辑参数');
    setCurrentRecord(record);
    setModalVisible(true);
  }, []);

  // 处理删除
  const handleDelete = useCallback(
    (record: SysParam) => {
      confirm({
        title: '确认删除',
        content: `确定要删除参数"${record.name}"吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          deleteMutation.mutate(record.id);
        },
      });
    },
    [deleteMutation],
  );

  // 处理批量删除
  const handleBatchDelete = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的参数');
      return;
    }

    confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个参数吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        batchDeleteMutation.mutate(selectedRowKeys as number[]);
      },
    });
  }, [selectedRowKeys, batchDeleteMutation, message]);

  // 处理刷新
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // 处理列设置
  const handleColumnSettings = useCallback(() => {
    message.info('列设置功能开发中...');
  }, [message]);

  // 处理展开搜索
  const handleToggleSearchExpand = useCallback(() => {
    setSearchExpanded((prev) => !prev);
  }, []);

  // 处理状态变更
  const handleStatusChange = useCallback(
    (record: SysParam, checked: boolean) => {
      const newStatus = checked ? 1 : 0;
      updateMutation.mutate({
        id: record.id,
        data: { ...record, status: newStatus },
      });
    },
    [updateMutation],
  );

  // 处理表格选择变更
  const handleSelectionChange = useCallback((keys: React.Key[], _rows: SysParam[]) => {
    setSelectedRowKeys(keys);
  }, []);

  // 处理弹窗确认
  const handleModalOk = useCallback(
    (values: SysParamFormData) => {
      setModalLoading(true);

      if (currentRecord) {
        // 编辑模式
        updateMutation.mutate({
          id: currentRecord.id,
          data: values,
        });
      } else {
        // 新增模式
        createMutation.mutate(values);
      }

      setModalLoading(false);
    },
    [currentRecord, createMutation, updateMutation],
  );

  // 处理弹窗取消
  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setCurrentRecord(undefined);
  }, []);

  // 计算加载状态
  const tableLoading =
    isLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    batchDeleteMutation.isPending;

  return (
    <div className="bg-gray-50 h-full flex flex-col params-container">
      {/* 搜索表单 */}
      <SearchForm
        onSearch={handleSearch}
        onReset={handleReset}
        loading={isLoading}
        expanded={searchExpanded}
        onToggleExpand={handleToggleSearchExpand}
      />

      <Card className="flex-1">
        {/* 表格操作按钮 */}
        <TableActionButtons
          onAdd={handleAdd}
          onBatchDelete={handleBatchDelete}
          onRefresh={handleRefresh}
          onColumnSettings={handleColumnSettings}
          selectedRowKeys={selectedRowKeys}
          loading={tableLoading}
        />

        {/* 参数表格 */}
        <ParamTable
          data={result?.records || []}
          loading={tableLoading}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={handleSelectionChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          pagination={{
            pageSize: searchParams.pageSize,
            current: searchParams.pageNum,
            ...PAGINATION_CONFIG,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            total: total,
            onChange(page, pageSize) {
              setSearchParams({
                ...searchParams,
                pageNum: page,
                pageSize: pageSize,
              });
            },
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <ParamModal
        open={modalVisible}
        title={modalTitle}
        loading={modalLoading}
        initialValues={currentRecord}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default Params;
