import { Switch } from 'antd';
import type { ReactNode } from 'react';
import { type Category, type SettingKey, usePreferencesStore } from '@/stores/store';
import type { Preferences } from '@/stores/storeState';
import './switchItem.scss';

/**
 * 获取 preferences 中的值
 * @param preferences - 全局状态库中的 preferences
 * @param category - 类别
 * @param key - 设置键
 * @returns 设置值
 */
const getPreferenceValue = <T extends Category, K extends SettingKey<T>>(
  preferences: Preferences,
  category: T,
  pKey: K,
): Preferences[T][K] => {
  return preferences[category][pKey];
};

/**
 * 切换组件
 * @returns SwitchItem
 */
const SwitchItem: React.FC<SwitchItemProps> = (props) => {
  const { title, disabled = true, shortcut, style, category, pKey } = props;

  // 从全局状态库中获取配置
  const { preferences, updatePreferences } = usePreferencesStore();

  // 状态值
  const value = getPreferenceValue(preferences, category, pKey as unknown as SettingKey<Category>);

  /**
   * 切换时更新状态
   * @param checked
   */
  const changePreferences = (checked: boolean) => {
    updatePreferences(category, pKey, checked);
  };

  return (
    <div className="switch-item" style={style}>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px',
          lineHeight: '20px',
        }}
      >
        {title}
      </span>
      {shortcut && (
        <span
          style={{
            opacity: '0.6',
            fontSize: '12px',
            lineHeight: '16px',
            marginLeft: 'auto',
            marginRight: '8px',
          }}
        >
          {shortcut}
        </span>
      )}
      {/* 切换 */}
      <Switch disabled={disabled} onChange={changePreferences} checked={value} />
    </div>
  );
};
export default SwitchItem;

export interface SwitchItemProps {
  title?: string;
  disabled?: boolean;
  shortcut?: ReactNode | string;
  children?: ReactNode;
  style?: React.CSSProperties;
  category: Category;
  pKey: SettingKey<keyof Preferences[Category]>;
}
