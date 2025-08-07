import {
  AppstoreAddOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input, type InputRef, Row, Space } from 'antd';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import EndpointConfigTable from './EndpointConfigTable';
import EndpointTypeTree from './EndpointTypeTree';
import { useTranslation } from 'react-i18next';

/**
 * 端点配置模块
 */
const EndpointConfig: React.FC = () => {
  // 当前编辑状态
  const [action, setAction] = useState<string>('view');

  // 当前选中的分类数据
  const [selectCategory, setSelectCategory] = useState<Record<string, any> | null>(null);
  // 名称框
  const nameRef = useRef<InputRef>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (action !== 'view' && nameRef.current) {
      nameRef.current.focus();
    }
  }, [action]);

  /**
   * 树节点选中事件
   * @param info 树节点信息
   */
  const onSelectTree = (info: any) => {
    // 查询配置数据
    console.log(info);
    // 假设是后台查询到的配置数据
    setSelectCategory(info);
  };

  /**
   * 配置数据发生变更
   * @param data 配置数据
   */
  const onConfigDataChange = (data: any[]) => {};

  /**
   * 保存数据
   */
  const saveData = () => {
    // 先进行数据校验，校验通过再进行保存
  };

  /**
   * 删除数据
   */
  const deleteData = () => {};

  /**
   * 新增数据
   */
  const addData = () => {
    // 首先清空所有选项
    // 然后设置action
  };

  return (
    <Row gutter={8} style={{ height: '100%' }}>
      <Col span={6}>
        {/* 左边端点分类 */}
        <EndpointTypeTree onSelect={onSelectTree} />
      </Col>
      <Col span={18}>
        {/* 右边端点列表 */}
        <Card
          style={{ flex: 1, minWidth: 0, height: '100%' }}
          styles={{
            body: {
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <Row style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <Col
              span={24}
              style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
              }}
            >
              <Divider orientation="left">
                <SettingOutlined style={{ marginRight: '8px' }} />
                基础信息
              </Divider>
              <Form labelCol={{ span: 6 }} disabled={action === 'view'}>
                <Row gutter={24} style={{ margin: '0' }}>
                  <Col span={8}>
                    <Form.Item name="configName" label="名称">
                      <Input placeholder="请输入配置名称" ref={nameRef} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="icon" label="图标">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="supportedMode" label="支持模式">
                      <Input placeholder="请输入类型名称" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="description" label="描述">
                      <TextArea placeholder="描述性信息" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Divider orientation="left">
                <AppstoreAddOutlined style={{ marginRight: '8px' }} />
                端点配置
              </Divider>
              {/* 端点配置表格 */}
              <EndpointConfigTable
                configData={selectCategory}
                action={action}
                onConfigDataChange={onConfigDataChange}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Divider style={{ margin: '8px 0 12px 0' }} />
              <Space>
                <Button
                  icon={<PlusOutlined />}
                  disabled={selectCategory === null || selectCategory.node.type === 'config'}
                  type="primary"
                  onClick={() => setAction('add')}
                >
                  {t('common.operation.add')}
                </Button>
                <Button
                  icon={<EditOutlined />}
                  disabled={selectCategory === null || selectCategory.node.type !== 'config'}
                  onClick={() => setAction('modify')}
                >
                  {t('common.operation.edit')}
                </Button>
                <Button
                  icon={<SaveOutlined />}
                  type="primary"
                  disabled={action === 'view'}
                  onClick={() => setAction('view')}
                >
                  {t('common.operation.save')}
                </Button>
                <Button icon={<CloseOutlined />} disabled={action === 'view'} onClick={() => setAction('view')}>
                  {t('common.operation.cancel')}
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  disabled={selectCategory === null || selectCategory.node.type !== 'config'}
                  onClick={() => {}}
                >
                  {t('common.operation.delete')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
export default EndpointConfig;
