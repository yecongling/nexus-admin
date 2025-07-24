import { Tooltip } from 'antd';
import { t } from 'i18next';
import FullContent from '../icons/FullContent';
import HeaderMixedNav from '../icons/HeaderMixedNav';
import HeaderNav from '../icons/HeaderNav';
import HeaderSidebarNav from '../icons/HeaderSidebarNav';
import MixedNav from '../icons/MixedNav';
import SidebarMixedNav from '../icons/SidebarMixedNav';
import SidebarNav from '../icons/SidebarNav';
import '../Theme/theme.scss';
import './layout.scss';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { usePreferencesStore } from '@/stores/store';

// 定义组件映射
const components: Record<string, React.FC> = {
  'full-content': FullContent,
  'header-nav': HeaderNav,
  'mixed-nav': MixedNav,
  'sidebar-mixed-nav': SidebarMixedNav,
  'sidebar-nav': SidebarNav,
  'header-mixed-nav': HeaderMixedNav,
  'header-sidebar-nav': HeaderSidebarNav,
};

// 预设的布局
const PRESET = [
  {
    name: t('preferences.vertical'),
    tip: t('preferences.verticalTip'),
    type: 'sidebar-nav',
  },
  {
    name: t('preferences.twoColumn'),
    tip: t('preferences.twoColumnTip'),
    type: 'sidebar-mixed-nav',
  },
  {
    name: t('preferences.horizontal'),
    tip: t('preferences.horizontalTip'),
    type: 'header-nav',
  },
  {
    name: t('preferences.headerSidebarNav'),
    tip: t('preferences.headerSidebarNavTip'),
    type: 'header-sidebar-nav',
  },
  {
    name: t('preferences.mixedMenu'),
    tip: t('preferences.mixedMenuTip'),
    type: 'mixed-nav',
  },
  {
    name: t('preferences.headerTwoColumn'),
    tip: t('preferences.headerTwoColumnTip'),
    type: 'header-mixed-nav',
  },
  {
    name: t('preferences.fullContent'),
    tip: t('preferences.fullContentTip'),
    type: 'full-content',
  },
];
/**
 * 布局
 */
const MyLayout: React.FC = () => {
  const { updatePreferences } = usePreferencesStore();
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        gap: '1.25rem',
      }}
    >
      {PRESET.map((item) => (
        <div
          key={item.name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            width: '100px',
          }}
          onClick={() => {
            updatePreferences('app', 'layout', item.name);
          }}
        >
          <div
            className="outline-box"
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {(() => {
              const Comp = components[item.type];
              return <Comp />;
            })()}
          </div>
          <div className="layoutTitle">
            {item.name}
            {item.tip && (
              <Tooltip title={item.tip}>
                <QuestionCircleOutlined
                  style={{
                    fontSize: '.75rem',
                    marginLeft: '.25rem',
                  }}
                />
              </Tooltip>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export default MyLayout;
