import { QuestionCircleFilled, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Form, Input, InputNumber, type InputRef, Radio, Space, Switch, Tooltip, TreeSelect } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type React from 'react';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import DragModal from '@/components/modal/DragModal';
import { menuService } from '@/services/system/menu/menuApi';
import { addIcon } from '@/utils/utils';
import IconPanel from '@/components/IconPanel';

// 菜单类型枚举
enum MenuType {
  TOP_LEVEL = 0,
  SUB_MENU = 1,
  SUB_ROUTE = 2,
  PERMISSION_BUTTON = 3,
}

// 表单初始值
const initialFormValues = {
  menuType: MenuType.TOP_LEVEL,
  route: false,
  hidden: false,
  internalOrExternal: false,
  status: true,
};

// 菜单信息弹窗的参数
export interface MenuInfoModalProps {
  visible: boolean;
  currentRow: MenuData | null;
  onOk: (data: MenuData) => void;
  onCancel: () => void;
}

// 菜单数据类型
export interface MenuData {
  id?: string | number;
  menuType: MenuType;
  name: string;
  parentId?: string | number;
  url?: string;
  component?: string;
  componentName?: string;
  redirect?: string;
  icon?: string;
  sortNo?: number;
  route?: boolean;
  hidden?: boolean;
  internalOrExternal?: boolean;
  status: boolean;
  perms?: string;
}

/**
 * 菜单信息编辑弹窗
 */
const MenuInfoModal: React.FC<MenuInfoModalProps> = ({ visible, currentRow, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const nameRef = useRef<InputRef>(null);
  const [menuType, setMenuType] = useState<MenuType>(MenuType.TOP_LEVEL);
  const { t } = useTranslation();

  // 初始化表单数据
  useEffect(() => {
    if (!visible) {
      return;
    }
    const newMenuType = currentRow?.menuType ?? MenuType.TOP_LEVEL;
    setMenuType(newMenuType);

    if (currentRow) {
      form.setFieldsValue(currentRow);
    } else {
      form.resetFields();
    }
  }, [currentRow, form, visible]);

  // 递归处理目录数据，对 title 进行国际化
  const translateDirectory = useCallback(
    (data: any[], typeFilter?: MenuType): any[] => {
      const loop = (items: any[]): any[] =>
        items
          .filter((item) => {
            // 如果传入了类型过滤，则只保留匹配类型的项
            return typeFilter === MenuType.PERMISSION_BUTTON
              ? item.menuType !== MenuType.PERMISSION_BUTTON
              : item.menuType === typeFilter;
          })
          .map((item) => {
            const iconNode = item.icon ? addIcon(item.icon) : null;

            const newItem: any = {
              ...item,
              selectable:
                menuType !== MenuType.PERMISSION_BUTTON || (!Array.isArray(item.children) || item.children.length === 0),
              title: (
                <Space>
                  {iconNode}
                  {t(item.title)}
                </Space>
              ),
            };

            if (Array.isArray(item.children) && item.children.length > 0) {
              newItem.children = loop(item.children);
            }

            return newItem;
          });

      return loop(data);
    },
    [t, menuType],
  );

  // 使用 useQuery 获取目录数据
  const { data: allDirectoryData, isLoading } = useQuery({
    queryKey: ['sys_menu_directory'],
    queryFn: async () => {
      return await menuService.getDirectory();
    },
    enabled: visible,
  });

  // 根据当前菜单类型进行过滤并国际化
  const directoryData = useMemo(() => {
    return translateDirectory(
      allDirectoryData || [],
      menuType === MenuType.SUB_MENU || menuType === MenuType.SUB_ROUTE ? MenuType.TOP_LEVEL : menuType,
    );
  }, [allDirectoryData, menuType]);

  // 处理表单提交
  const handleOk = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const formData: MenuData = {
        ...values,
        status: Boolean(values.status),
      };
      onOk(formData);
    } catch (errorInfo: any) {
      const firstErrorField = errorInfo.errorFields?.[0]?.name;
      if (firstErrorField) {
        form.scrollToField(firstErrorField);
        form.focusField(firstErrorField);
      }
    }
  }, []);

  // 处理菜单类型变更
  const handleMenuTypeChange = useCallback(
    (value: MenuType) => {
      setMenuType(value);
      requestAnimationFrame(() => {
        if (value === MenuType.SUB_ROUTE) {
          form.setFieldsValue({ route: true });
        }
        nameRef.current?.focus();
      });
    },
    [form, nameRef],
  );

  // 选择图标
  const handleIconSelect = useCallback((icon: string) => {
    if (icon) {
      form.setFieldsValue({ icon });
    }
  }, []);

  // 弹窗打开后的处理
  const handleAfterOpenChange = useCallback((open: boolean) => {
    if (open) {
      nameRef.current?.focus();
    }
  }, []);

  // 根据菜单类型判断是否显示路由相关字段
  const showRouteFields = useMemo(() => menuType !== MenuType.PERMISSION_BUTTON, [menuType]);

  return (
    <DragModal
      width={800}
      styles={{
        body: {
          padding: '20px 40px',
          overflowY: 'auto',
          height: 600
        },
      }}
      title={`${currentRow ? '编辑' : '新增'}菜单数据`}
      open={visible}
      onOk={handleOk}
      loading={isLoading}
      onCancel={onCancel}
      afterOpenChange={handleAfterOpenChange}
    >
      <Form form={form} initialValues={initialFormValues} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="menuType" label="菜单类型">
          <Radio.Group buttonStyle="solid" onChange={(e) => handleMenuTypeChange(e.target.value)}>
            <Radio.Button value={MenuType.TOP_LEVEL}>一级菜单</Radio.Button>
            <Radio.Button value={MenuType.SUB_MENU}>子菜单</Radio.Button>
            <Radio.Button value={MenuType.SUB_ROUTE}>子路由</Radio.Button>
            <Radio.Button value={MenuType.PERMISSION_BUTTON}>权限按钮</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="name"
          label={menuType === MenuType.PERMISSION_BUTTON ? '权限名称' : '菜单名称'}
          rules={[{ required: true, message: '菜单名称不能为空!' }]}
        >
          <Input autoFocus ref={nameRef} autoComplete="off" />
        </Form.Item>
        {menuType === MenuType.PERMISSION_BUTTON && (
          <Form.Item name="perms" label="权限标识" rules={[{ required: true, message: '权限标识不能为空！' }]}>
            <Input allowClear autoComplete="off" />
          </Form.Item>
        )}
        {menuType !== MenuType.TOP_LEVEL && (
          <Form.Item name="parentId" label="上级菜单">
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              styles={{ popup: { root: { maxHeight: 400, overflow: 'auto' } } }}
              placeholder="请选择上级目录"
              treeData={directoryData}
            />
          </Form.Item>
        )}
        {showRouteFields && (
          <>
            <Form.Item
              name="url"
              label={
                <>
                  <Tooltip title="访问的路由地址，如为外链，则路由地址需要以`http(s)://开头`">
                    <QuestionCircleFilled />
                  </Tooltip>
                  路由地址
                </>
              }
              rules={[
                {
                  required: menuType === MenuType.SUB_MENU,
                  message: '路径不能为空!',
                },
              ]}
            >
              <Input allowClear autoComplete="off" />
            </Form.Item>
            <Form.Item
              name="component"
              label="前端组件"
              rules={[
                {
                  required: menuType === MenuType.SUB_MENU,
                  message: '前端组件配置不能为空!',
                },
              ]}
            >
              <Input allowClear autoComplete="off" />
            </Form.Item>
            <Form.Item name="componentName" label="组件名称">
              <Input allowClear autoComplete="off" />
            </Form.Item>
            <Form.Item name="redirect" label="默认跳转地址">
              <Input allowClear autoComplete="off" />
            </Form.Item>
            <Form.Item name="icon" label="菜单图标">
              <Input
                allowClear
                autoComplete="off"
                addonAfter={
                  <Dropdown
                    trigger={['click']}
                    placement="bottom"
                    popupRender={() => <IconPanel onSelect={handleIconSelect} />}
                    overlayClassName="w-[360px] h-[300px] bg-white overflow-y-auto p-2 shadow-xl"
                  >
                    <SettingOutlined className="cursor-pointer" />
                  </Dropdown>
                }
              />
            </Form.Item>
          </>
        )}
        <Form.Item name="sortNo" label="排序">
          <InputNumber min={0} autoComplete="off" />
        </Form.Item>
        {(menuType === MenuType.SUB_MENU || menuType === MenuType.SUB_ROUTE) && (
          <Form.Item name="route" label="是否路由菜单">
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              defaultChecked
              disabled={menuType === MenuType.SUB_ROUTE}
            />
          </Form.Item>
        )}
        {menuType !== MenuType.PERMISSION_BUTTON && (
          <Form.Item name="hidden" label="隐藏路由">
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
        )}
        {menuType === MenuType.SUB_MENU && (
          <Form.Item
            name="internalOrExternal"
            label={
              <>
                <Tooltip title="选择是外链，则路由地址需要以`http(s)://开头`">
                  <QuestionCircleFilled />
                </Tooltip>
                打开方式
              </>
            }
          >
            <Switch checkedChildren="外部" unCheckedChildren="内部" />
          </Form.Item>
        )}
        <Form.Item name="status" label="状态">
          <Switch checkedChildren="正常" unCheckedChildren="停用" />
        </Form.Item>
      </Form>
    </DragModal>
  );
};

export default MenuInfoModal;
