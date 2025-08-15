import type React from 'react';
import { useReducer, useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { App, Button, Card, ConfigProvider, Space, Switch, Tooltip, type TableProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify-icon/react';
import { isEqual } from 'lodash-es';

import { menuService } from '@/services/system/menu/menuApi';
import MenuInfoModal from './MenuInfoModal';
import './menu.scss';
import useParentSize from '@/hooks/useParentSize';
import { getIcon } from '@/utils/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SearchBar from './SearchBar';
import ActionButtons from './ActionButtons';
import DataTable from './DataTable';

/**
 * 系统菜单维护
 */
const Menu: React.FC = () => {
  const { modal } = App.useApp();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  // 合并的状态
  const [state, dispatch] = useReducer((prev: any, action: any) => ({ ...prev, ...action }), {
    openEditModal: false,
    currentRow: null,
    selRows: [],
  });
  // 查询条件
  const [searchParams, setSearchParams] = useState({});

  // 容器高度计算（表格）
  const { parentRef, height } = useParentSize();

  // 查询菜单数据
  const { isLoading, data, refetch } = useQuery({
    // 依赖searchParams, 当searchParams变化时，会重新执行queryFn
    queryKey: ['sys_menu', searchParams],
    queryFn: menuService.getAllMenus,
  });

  // 新增菜单mutation
  const addMenuMutation = useMutation({
    mutationFn: menuService.addMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sys_menu', searchParams] });
      closeEditModal();
    },
  });

  // 修改单个菜单mutation
  const updateMenuMutation = useMutation({
    mutationFn: menuService.updateMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sys_menu', searchParams] });
      closeEditModal();
    },
  });

  // 删除菜单mutation
  const deleteMenuMutation = useMutation({
    mutationFn: menuService.deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sys_menu', searchParams] });
    },
  });

  // 批量删除菜单mutation
  const batchDeleteMenuMutation = useMutation({
    mutationFn: menuService.deleteMenuBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sys_menu', searchParams] });
    },
  });

  // 切换菜单状态mutation
  const toggleMenuStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) => menuService.toggleMenuStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sys_menu', searchParams] });
    },
  });

  // 定义表格列
  const columns: TableProps['columns'] = [
    {
      title: '名称',
      width: 120,
      dataIndex: 'name',
      align: 'left',
      key: 'name',
      sorter: (a: any, b: any) => {
        return a.name.localeCompare(b.name);
      },
      render(value) {
        return t(value);
      },
    },
    {
      title: '路径',
      width: 140,
      align: 'left',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '图标',
      width: 80,
      dataIndex: 'icon',
      key: 'icon',
      align: 'center',
      render(value) {
        return getIcon(value);
      },
    },
    {
      title: '组件',
      width: 140,
      align: 'left',
      dataIndex: 'component',
      key: 'component',
    },
    {
      title: '类型',
      width: 80,
      dataIndex: 'menuType',
      key: 'menuType',
      align: 'center',
      render(value) {
        switch (value) {
          case 0:
            return <Tooltip title="目录"><Icon icon="flat-color-icons:folder" className="text-xl block" /></Tooltip>;
          case 1:
            return <Tooltip title="路由"><Icon icon="ic:round-route" className="text-xl block text-green-400" /></Tooltip>;
          case 2:
            return <Tooltip title="子路由"><Icon icon="ic:round-route" className="text-xl block text-green-400" /></Tooltip>;
          case 3:
            return <Tooltip title="权限按钮"><Icon icon="emojione-v1:p-button" className="text-xl block" /></Tooltip>;
          default:
            return '';
        }
      },
    },
    {
      title: '序号',
      width: 80,
      dataIndex: 'sortNo',
      key: 'sortNo',
      sorter: (a: any, b: any) => {
        return a.sortNo - b.sortNo;
      },
      align: 'center',
    },
    {
      title: '状态',
      width: 80,
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render(value: boolean, record: any) {
        return (
          <Switch
            size="small"
            value={value}
            onChange={(checked) => {
              toggleMenuStatusMutation.mutate({ id: record.id, status: checked });
            }}
          />
        );
      },
    },
    {
      title: '操作',
      width: 40,
      dataIndex: 'operation',
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <Space size={0}>
            <Tooltip title={t('common.operation.edit')}>
              <Button
                type="text"
                icon={<Icon icon="fluent-color:calendar-edit-16" className="text-xl block" />}
                onClick={() => {
                  dispatch({
                    currentRow: record,
                    openEditModal: true,
                  });
                }}
              />
            </Tooltip>
            <Tooltip title={t('common.operation.delete')}>
              <Button
                type="text"
                icon={<Icon icon="fluent:delete-dismiss-24-filled" className="text-xl block text-[#ff4d4f]" />}
                onClick={() => delMenu(record.id)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  /**
   * 多行选中的配置
   */
  const rowSelection: TableProps['rowSelection'] = {
    // 行选中的回调
    onChange(_selectedRowKeys, selectedRows) {
      dispatch({
        selRows: selectedRows,
      });
    },
    columnWidth: 32,
    fixed: true,
  };

  /**
   * 检索表单提交
   * @param values  检索表单条件
   */
  const onFinish = (values: any) => {
    // 拼接查询条件，没有选择的条件就不拼接
    const queryCondition = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== undefined && value !== ''),
    );
    // 判断参数是否发生变化
    if (isEqual(queryCondition, searchParams)) {
      // 参数没有变化，手动刷新数据
      refetch();
      return;
    }
    // 参数变了，更新查询参数，自动触发查询
    setSearchParams(queryCondition);
  };

  /**
   * 批量删除选中的菜单
   */
  const deleteBatch = () => {
    modal.confirm({
      title: '批量删除',
      icon: <ExclamationCircleFilled />,
      content: '确定批量删除菜单吗？数据删除后将无法恢复！',
      onOk() {
        // 调用删除接口，删除成功后刷新页面数据
        batchDeleteMenuMutation.mutate(state.selRows.map((item: any) => item.id));
      },
    });
  };

  // 新增公共确认方法
  const confirmDelete = (content: string, onConfirm: () => void) => {
    modal.confirm({
      title: '确认删除？',
      icon: <ExclamationCircleFilled />,
      content,
      onOk: onConfirm,
    });
  };

  // 修改后的删除方法
  const delMenu = (id: string) => {
    confirmDelete('确定删除菜单吗？数据删除后将无法恢复！', () => {
      deleteMenuMutation.mutate(id);
    });
  };

  /**
   * 新增按钮点击
   */
  const onAddMenuClick = () => {
    dispatch({
      openEditModal: true,
      currentRow: null,
    });
  };

  /**
   * 关闭编辑弹窗
   */
  const closeEditModal = () => {
    dispatch({
      openEditModal: false,
    });
  };

  /**
   * 弹窗点击确定的回调函数
   * @param menuData 编辑的菜单数据
   */
  const onEditOk = async (menuData: Record<string, any>) => {
    if (state.currentRow == null) {
      // 新增数据
      addMenuMutation.mutate(menuData);
    } else {
      // 编辑数据
      updateMenuMutation.mutate(menuData);
    }
  };

  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 0,
            },
          },
        }}
      >
        <Card>
          <SearchBar onFinish={onFinish} isLoading={isLoading} />
        </Card>
      </ConfigProvider>
      {/* 查询表格 */}
      <Card className="mt-2! min-h-0 flex-1" styles={{ body: { height: '100%' } }} ref={parentRef}>
        {/* 操作按钮 */}
        <ActionButtons
          onAddMenuClick={onAddMenuClick}
          onDeleteBatch={deleteBatch}
          selRowsLength={state.selRows.length}
        />
        {/* 表格数据 */}
        <DataTable
          dataSource={data || []}
          columns={columns}
          isLoading={isLoading}
          rowKey="id"
          scroll={{ y: height - 128, x: 'max-content' }}
          rowSelection={{ ...rowSelection, checkStrictly: false }}
        />
      </Card>

      {/* 新增、编辑弹窗 */}
      <MenuInfoModal
        visible={state.openEditModal}
        currentRow={state.currentRow}
        onCancel={closeEditModal}
        onOk={onEditOk}
      />
    </>
  );
};
export default Menu;
