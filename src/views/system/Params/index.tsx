import type React from 'react';
import { useState, useCallback } from 'react';
import { App, Card, Modal } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SearchForm from './components/SearchForm';
import TableActionButtons from './components/TableActionButtons';
import ParamTable from './components/ParamTable';
import ParamDrawer from './components/ParamDrawer';
import {
  sysParamService,
  type SysParam,
  type SysParamSearchParams,
  type SysParamFormData,
} from '@/services/system/params';
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
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [currentRecord, setCurrentRecord] = useState<SysParam | undefined>();
  const [drawerLoading, setDrawerLoading] = useState(false);
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
  const total = result?.totalRow || 0;

  // 新增参数
  const createMutation = useMutation({
    mutationFn: (data: SysParamFormData) => sysParamService.createParam(data),
    onSuccess: () => {
      message.success('新增参数成功');
      setDrawerVisible(false);
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
      setDrawerVisible(false);
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

  // 导入参数
  const importMutation = useMutation({
    mutationFn: (file: File) => sysParamService.importParams(file),
    onSuccess: () => {
      message.success('导入参数成功');
      queryClient.invalidateQueries({ queryKey: ['sys_params'] });
    },
    onError: (error: any) => {
      message.error(`导入参数失败: ${error.message || '未知错误'}`);
    },
  });

  // 导出参数
  const exportMutation = useMutation({
    mutationFn: (options: { type: 'all' | 'selected'; selectedIds?: number[]; searchParams?: SysParamSearchParams }) => {
      const exportOptions = {
        type: options.type,
        selectedIds: options.selectedIds,
        searchParams: options.searchParams,
      };
      return sysParamService.exportParams(exportOptions);
    },
    onSuccess: (blob) => {
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `系统参数_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('导出参数成功');
    },
    onError: (error: any) => {
      message.error(`导出参数失败: ${error.message || '未知错误'}`);
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
    setDrawerTitle('新增参数');
    setCurrentRecord(undefined);
    setDrawerVisible(true);
  }, []);

  // 处理编辑
  const handleEdit = useCallback((record: SysParam) => {
    setDrawerTitle('编辑参数');
    setCurrentRecord(record);
    setDrawerVisible(true);
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

  // 处理导入
  const handleImport = useCallback((file: File) => {
    importMutation.mutate(file);
  }, [importMutation]);

  // 处理导出
  const handleExport = useCallback((type: 'all' | 'selected') => {
    const exportOptions = {
      type,
      selectedIds: type === 'selected' ? selectedRowKeys as number[] : undefined,
      searchParams: type === 'all' ? searchParams : undefined,
    };
    
    exportMutation.mutate(exportOptions);
  }, [exportMutation, selectedRowKeys, searchParams]);

  // 处理展开搜索
  const handleToggleSearchExpand = useCallback(() => {
    setSearchExpanded((prev) => !prev);
  }, []);

  // 处理状态变更
  const handleStatusChange = useCallback(
    (record: SysParam, checked: boolean) => {
      updateMutation.mutate({
        id: record.id,
        data: { ...record, status: checked },
      });
    },
    [updateMutation],
  );

  // 处理表格选择变更
  const handleSelectionChange = useCallback((keys: React.Key[], _rows: SysParam[]) => {
    setSelectedRowKeys(keys);
  }, []);

  // 处理抽屉确认
  const handleDrawerOk = useCallback(
    (values: SysParamFormData) => {
      setDrawerLoading(true);

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

      setDrawerLoading(false);
    },
    [currentRecord, createMutation, updateMutation],
  );

  // 处理抽屉取消
  const handleDrawerCancel = useCallback(() => {
    setDrawerVisible(false);
    setCurrentRecord(undefined);
  }, []);

  // 计算加载状态
  const tableLoading =
    isLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    batchDeleteMutation.isPending ||
    importMutation.isPending ||
    exportMutation.isPending;

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
          onImport={handleImport}
          onExport={handleExport}
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

      {/* 新增/编辑抽屉 */}
      <ParamDrawer
        open={drawerVisible}
        title={drawerTitle}
        loading={drawerLoading}
        initialValues={currentRecord}
        onOk={handleDrawerOk}
        onCancel={handleDrawerCancel}
      />
    </div>
  );
};

export default Params;
