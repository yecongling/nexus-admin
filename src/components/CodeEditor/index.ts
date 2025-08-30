// 导出主组件
export { default as CodeEditor } from './CodeEditor';

// 导出类型定义
export type {
  SupportedLanguage,
  EditorTheme,
  CodeEditorProps,
  CodeEditorRef,
} from './types';

// 导出配置常量
export {
  LANGUAGE_CONFIG_MAP,
  THEME_CONFIG,
} from './types';

// 默认导出主组件
export { default } from './CodeEditor';

// 导出示例和测试组件（可选）
export { default as CodeEditorExample } from './example';
export { default as TestCodeEditor } from './test';
export { default as SimpleTest } from './simple-test';
