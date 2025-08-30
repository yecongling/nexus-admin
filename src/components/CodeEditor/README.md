# 通用代码编辑器组件

基于 `@monaco-editor/react` 封装的通用代码编辑器组件，支持多种编程语言的语法高亮和丰富的编辑器功能。

## 特性

- 🚀 支持多种编程语言：JavaScript、TypeScript、Python、Java、Groovy、SQL、JSON、HTML、CSS、XML、YAML、Markdown、Shell 等
- 🎨 支持多种主题：浅色、深色、高对比度
- ⚙️ 丰富的配置选项：字体大小、行高、行号显示、小地图等
- 🔧 完整的编辑器 API：代码格式化、查找替换、撤销重做等
- 📱 响应式设计，支持移动端
- 🎯 TypeScript 支持，完整的类型定义
- ♿ 无障碍支持，符合 WCAG 标准

## 安装依赖

```bash
bun add @monaco-editor/react
```

## 基本使用

```tsx
import React, { useState } from 'react';
import { CodeEditor } from '@/components/CodeEditor';

const MyComponent: React.FC = () => {
  const [code, setCode] = useState('console.log("Hello, World!");');

  return (
    <CodeEditor
      value={code}
      language="javascript"
      theme="vs-dark"
      height="400px"
      onChange={setCode}
    />
  );
};
```

## 高级使用

```tsx
import React, { useRef } from 'react';
import { CodeEditor, type CodeEditorRef } from '@/components/CodeEditor';

const AdvancedComponent: React.FC = () => {
  const editorRef = useRef<CodeEditorRef>(null);

  const handleFormatCode = () => {
    editorRef.current?.formatCode();
  };

  const handleGoToLine = () => {
    editorRef.current?.goToLine(10);
  };

  return (
    <div>
      <button onClick={handleFormatCode}>格式化代码</button>
      <button onClick={handleGoToLine}>跳转到第10行</button>
      
      <CodeEditor
        ref={editorRef}
        value="// 你的代码"
        language="typescript"
        theme="vs-dark"
        height="500px"
        showLineNumbers={true}
        showMinimap={true}
        fontSize={16}
        placeholder="请输入代码..."
        onChange={(value) => console.log('代码变化:', value)}
        onMount={(editor) => console.log('编辑器已挂载:', editor)}
        onValidate={(markers) => console.log('验证标记:', markers)}
      />
    </div>
  );
};
```

## 支持的编程语言

| 语言 | 标识符 | 文件扩展名 |
|------|--------|------------|
| JavaScript | `javascript` | `.js`, `.jsx`, `.mjs` |
| TypeScript | `typescript` | `.ts`, `.tsx` |
| Python | `python` | `.py`, `.pyw`, `.pyi` |
| Java | `java` | `.java` |
| Groovy | `groovy` | `.groovy`, `.gvy` |
| SQL | `sql` | `.sql` |
| JSON | `json` | `.json` |
| HTML | `html` | `.html`, `.htm`, `.xhtml` |
| CSS | `css` | `.css`, `.scss`, `.sass`, `.less` |
| XML | `xml` | `.xml`, `.xsd`, `.xsl`, `.xslt` |
| YAML | `yaml` | `.yml`, `.yaml` |
| Markdown | `markdown` | `.md`, `.markdown` |
| Shell | `shell` | `.sh`, `.bash`, `.zsh`, `.fish` |
| 纯文本 | `plaintext` | `.txt`, `.log` |

## 支持的主题

| 主题 | 标识符 | 描述 |
|------|--------|------|
| 浅色主题 | `vs` | 默认的浅色主题 |
| 深色主题 | `vs-dark` | 深色主题，适合夜间使用 |
| 高对比度 | `hc-black` | 高对比度主题，适合无障碍访问 |

## 组件属性

### 基础属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `value` | `string` | `''` | 代码内容 |
| `language` | `SupportedLanguage` | `'javascript'` | 编程语言 |
| `theme` | `EditorTheme` | `'vs'` | 编辑器主题 |
| `height` | `string \| number` | `'400px'` | 编辑器高度 |
| `width` | `string \| number` | `'100%'` | 编辑器宽度 |

### 显示选项

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `showLineNumbers` | `boolean` | `true` | 是否显示行号 |
| `showMinimap` | `boolean` | `true` | 是否显示小地图 |
| `wordWrap` | `'off' \| 'on' \| 'wordWrapColumn' \| 'bounded'` | `'off'` | 自动换行设置 |
| `readOnly` | `boolean` | `false` | 是否只读 |

### 字体和样式

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `fontSize` | `number` | `14` | 字体大小 |
| `fontFamily` | `string` | `'Consolas, "Courier New", monospace'` | 字体族 |
| `lineHeight` | `number` | `20` | 行高 |

### 功能选项

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `bracketPairColorization` | `boolean` | `true` | 是否显示括号匹配颜色 |
| `guides.indentation` | `boolean` | `true` | 是否显示缩进指南 |
| `guides.bracketPairs` | `boolean` | `true` | 是否显示括号对指南 |

### 回调函数

| 属性 | 类型 | 描述 |
|------|------|------|
| `onChange` | `(value: string \| undefined) => void` | 代码变化回调 |
| `onMount` | `(editor: editor.IStandaloneCodeEditor) => void` | 编辑器挂载完成回调 |
| `onValidate` | `(markers: editor.IMarker[]) => void` | 代码验证回调 |

## 编辑器实例方法

通过 `ref` 可以访问编辑器的实例方法：

### 基础操作

```tsx
// 获取编辑器实例
const editor = editorRef.current?.getEditor();

// 获取当前代码内容
const code = editorRef.current?.getValue();

// 设置代码内容
editorRef.current?.setValue('新的代码内容');

// 插入代码
editorRef.current?.insertCode('console.log("Hello");');

// 获取选中的代码
const selectedCode = editorRef.current?.getSelectedCode();

// 替换选中的代码
editorRef.current?.replaceSelectedCode('新的代码');
```

### 编辑操作

```tsx
// 格式化代码
editorRef.current?.formatCode();

// 撤销
editorRef.current?.undo();

// 重做
editorRef.current?.redo();

// 查找文本
editorRef.current?.findText('要查找的文本');

// 替换文本
editorRef.current?.replaceText('旧文本', '新文本');
```

### 导航操作

```tsx
// 跳转到指定行
editorRef.current?.goToLine(10);

// 获取光标位置
const position = editorRef.current?.getCursorPosition();

// 设置光标位置
editorRef.current?.setCursorPosition(10, 5);

// 聚焦编辑器
editorRef.current?.focus();

// 失焦编辑器
editorRef.current?.blur();
```

### 状态控制

```tsx
// 检查是否只读
const isReadOnly = editorRef.current?.isReadOnly();

// 设置只读状态
editorRef.current?.setReadOnly(true);

// 获取当前语言
const language = editorRef.current?.getLanguage();

// 设置语言
editorRef.current?.setLanguage('python');

// 获取当前主题
const theme = editorRef.current?.getTheme();

// 设置主题
editorRef.current?.setTheme('vs-dark');
```

## 自定义配置

可以通过 `options` 属性传入 Monaco Editor 的原生配置：

```tsx
<CodeEditor
  value={code}
  language="javascript"
  options={{
    // Monaco Editor 原生配置
    tabSize: 4,
    insertSpaces: false,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    // ... 更多配置
  }}
/>
```

## 样式定制

组件支持通过 `className` 和 `style` 属性进行样式定制：

```tsx
<CodeEditor
  value={code}
  language="javascript"
  className="my-custom-editor"
  style={{
    border: '2px solid #1890ff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }}
/>
```

## 无障碍支持

组件内置了无障碍支持功能：

- 所有表单控件都有正确的 `label` 关联
- 支持键盘导航
- 支持屏幕阅读器
- 高对比度主题支持

## 性能优化

- 使用 `useCallback` 和 `useMemo` 优化回调函数
- 支持大文件优化
- 按需加载 Monaco Editor 资源
- 自动布局调整

## 注意事项

1. **语言切换**：Monaco Editor 的语言切换需要通过重新渲染组件实现
2. **主题切换**：主题切换也需要重新渲染组件
3. **大文件处理**：对于非常大的文件，建议启用 `largeFileOptimizations` 选项
4. **内存管理**：组件会自动在卸载时清理编辑器实例

## 示例项目

查看 `example.tsx` 文件获取完整的使用示例，包括：

- 基础用法
- 高级配置
- 编辑器操作演示
- 实时配置调整

## 许可证

MIT License
