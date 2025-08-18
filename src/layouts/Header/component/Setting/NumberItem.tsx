import clsx from 'clsx';
import './switchItem.scss';
import { InputNumber } from 'antd';
import { usePreferencesStore, type Category, type SettingKey } from '@/stores/store';
import type { Preferences } from '@/stores/storeState';
import { useShallow } from 'zustand/shallow';

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
  pKey: K
): Preferences[T][K] => {
  return preferences[category][pKey];
};

/**
 * 数字框
 * @returns
 */
const NumberItem: React.FC<NumberItemProps> = (props) => {
  const { title, disabled, placeholder, category, pKey } = props;


// 从全局状态库中获取配置(这样写表明当前组件只会关注 value 和 updatePreferences 的变化)
  const { value, updatePreferences } = usePreferencesStore(
    useShallow((state) => ({
      value: getPreferenceValue(
        state.preferences,
        category,
        pKey as unknown as SettingKey<Category>
      ),
      updatePreferences: state.updatePreferences,
    }))
  );

  /**
   * 切换时更新状态
   * @param checked
   */
  const changePreferences = (value: number | string | null) => {
    updatePreferences(category, pKey, value);
  };

  return (
    <div
      className={clsx('number-item', {
        'pointer-events-none opacity-50': disabled,
      })}
    >
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
      <InputNumber
        disabled={disabled}
        placeholder={placeholder}
        style={{ width: '165px' }}
        value={value}
        onChange={changePreferences}
      />
    </div>
  );
};

export default NumberItem;

export interface NumberItemProps {
  title?: string;
  disabled?: boolean;
  placeholder?: string;
  category: Category;
    pKey: SettingKey<keyof Preferences[Category]>;
}
