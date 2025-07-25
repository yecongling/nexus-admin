import { SearchOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * 搜索菜单模态框组件
 * @returns
 */
const SearchMenuModal: React.FC = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<boolean>(false);

  /**
   * 检索菜单
   * @param name 菜单名
   */
  const searchMenu = (name: string) => {
    console.log(name);
  };

  return (
    <>
      <Input
        variant="filled"
        className='w-32!'
        placeholder={t('common.operation.search')}
        suffix={<SearchOutlined style={{ cursor: 'pointer', fontSize: '18px' }} />}
        onClick={() => setOpenModal(true)}
      />
      <Modal
        open={openModal}
        title={t('common.operation.search')}
        footer={null}
        width={600}
        onCancel={() => setOpenModal(false)}
      >
        这里是弹窗检索菜单的区域
      </Modal>
    </>
  );
};
export default SearchMenuModal;
