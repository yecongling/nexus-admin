import { create } from "zustand";
import { persist, type PersistOptions } from "zustand/middleware";
import { defaultPreferences } from "@/config/defaultPreferences";
import type { Preferences } from "./storeState";

// 定义category和key的类型
export type Category = keyof Preferences;
export type SettingKey<T extends Category> = keyof Preferences[T];

/**
 * 定义状态对象
 */
interface MenuStore {
  // 菜单状态
  menus: any[];
  setMenus: (menus: any[]) => void;
}

interface PreferencesStore {
  // 系统配置状态
  preferences: Preferences;
  // 更新全局状态
  updatePreferences: (category: Category, key: any, value: any) => void;
  // 重置全局状态
  resetPreferences: () => void;
}

// 创建菜单store
const useMenuStore = create<MenuStore>((set) => ({
  // 菜单状态
  menus: [],
  setMenus: (menus: any[]) => set({ menus: menus }),
}));

// 创建全局设置store
const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      // 系统配置状态
      preferences: defaultPreferences,
      // 更新全局状态
      updatePreferences: (category: Category, key: any, value: any) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            [category]: {
              ...state.preferences[category],
              [key]: value,
            },
          },
        })),
      // 重置全局状态
      resetPreferences: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: "preferences",
      getStorage: () => localStorage,
    } as PersistOptions<PreferencesStore>
  )
);

export { useMenuStore, usePreferencesStore };
