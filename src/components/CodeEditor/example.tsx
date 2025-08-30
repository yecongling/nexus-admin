import React, { useRef, useState, useId } from 'react';
import { Button, Select, Switch, Space, Card, Row, Col, InputNumber, Input } from 'antd';
import type { CodeEditorRef, SupportedLanguage, EditorTheme } from './index';
import CodeEditor from './index';

const { Option } = Select;

const CodeEditorExample: React.FC = () => {
  const editorRef = useRef<CodeEditorRef>(null);
  const languageId = useId();
  const themeId = useId();
  const fontSizeId = useId();
  const heightId = useId();
  const [code, setCode] = useState(`// 这是一个示例代码
function helloWorld() {
  console.log("Hello, World!");
  
  // 支持多种语言的语法高亮
  const data = {
    name: "Code Editor",
    version: "1.0.0",
    features: ["语法高亮", "代码补全", "错误提示"]
  };
  
  return data;
}

// 调用函数
helloWorld();`);

  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [theme, setTheme] = useState<EditorTheme>('vs');
  const [readOnly, setReadOnly] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [height, setHeight] = useState(400);

  // 示例代码
  const sampleCodes = {
    javascript: `// JavaScript 示例
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
    
    python: `# Python 示例
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,
    
    java: `// Java 示例
public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }
}`,
    
    sql: `-- SQL 示例
SELECT 
    u.user_id,
    u.username,
    COUNT(o.order_id) as order_count
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.user_id, u.username
HAVING order_count > 0
ORDER BY order_count DESC;`,
    
    json: `{
  "name": "示例配置",
  "version": "1.0.0",
  "description": "这是一个JSON配置文件示例",
  "settings": {
    "theme": "dark",
    "fontSize": 14,
    "autoSave": true,
    "features": [
      "语法高亮",
      "代码补全",
      "错误提示",
      "代码格式化"
    ]
  },
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}`,
    
    groovy: `// Groovy 示例
class Calculator {
    def add(a, b) {
        return a + b
    }
    
    def multiply(a, b) {
        return a * b
    }
}

def calc = new Calculator()
println "2 + 3 = " + calc.add(2, 3)
println "4 * 5 = " + calc.multiply(4, 5)`,
  };

  // 处理代码变化
  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  // 切换语言
  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    if (sampleCodes[newLanguage]) {
      setCode(sampleCodes[newLanguage]);
    }
  };

  // 编辑器挂载完成
  const handleEditorMount = (editor: any) => {
    console.log('编辑器已挂载:', editor);
  };

  // 验证回调
  const handleValidation = (markers: any[]) => {
    console.log('验证标记:', markers);
  };

  // 示例操作
  const handleFormatCode = () => {
    editorRef.current?.formatCode();
  };

  const handleGoToLine = () => {
    const lineNumber = parseInt(prompt('请输入行号:') || '1');
    if (!isNaN(lineNumber)) {
      editorRef.current?.goToLine(lineNumber);
    }
  };

  const handleInsertCode = () => {
    const code = prompt('请输入要插入的代码:');
    if (code) {
      editorRef.current?.insertCode(code);
    }
  };

  const handleGetSelectedCode = () => {
    const selectedCode = editorRef.current?.getSelectedCode();
    if (selectedCode) {
      alert(`选中的代码:\n${selectedCode}`);
    } else {
      alert('没有选中任何代码');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card title="通用代码编辑器组件示例" style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <div>
              <label htmlFor={languageId}>语言类型:</label>
              <Select
                id={languageId}
                value={language}
                onChange={handleLanguageChange}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value="javascript">JavaScript</Option>
                <Option value="typescript">TypeScript</Option>
                <Option value="python">Python</Option>
                <Option value="java">Java</Option>
                <Option value="groovy">Groovy</Option>
                <Option value="sql">SQL</Option>
                <Option value="json">JSON</Option>
                <Option value="html">HTML</Option>
                <Option value="css">CSS</Option>
                <Option value="xml">XML</Option>
                <Option value="yaml">YAML</Option>
                <Option value="markdown">Markdown</Option>
                <Option value="shell">Shell</Option>
              </Select>
            </div>
          </Col>
          
          <Col span={6}>
            <div>
              <label htmlFor={themeId}>主题:</label>
              <Select
                id={themeId}
                value={theme}
                onChange={setTheme}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value="vs">浅色主题</Option>
                <Option value="vs-dark">深色主题</Option>
                <Option value="hc-black">高对比度</Option>
              </Select>
            </div>
          </Col>
          
          <Col span={6}>
            <div>
              <label htmlFor={fontSizeId}>字体大小:</label>
              <InputNumber
                id={fontSizeId}
                value={fontSize}
                onChange={setFontSize}
                min={10}
                max={24}
                style={{ width: '100%', marginTop: '8px' }}
              />
            </div>
          </Col>
          
          <Col span={6}>
            <div>
              <label htmlFor={heightId}>编辑器高度:</label>
              <InputNumber
                id={heightId}
                value={height}
                onChange={setHeight}
                min={200}
                max={800}
                style={{ width: '100%', marginTop: '8px' }}
              />
            </div>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={6}>
            <Space>
              <Switch
                checked={readOnly}
                onChange={setReadOnly}
              />
              <span>只读模式</span>
            </Space>
          </Col>
          
          <Col span={6}>
            <Space>
              <Switch
                checked={showLineNumbers}
                onChange={setShowLineNumbers}
              />
              <span>显示行号</span>
            </Space>
          </Col>
          
          <Col span={6}>
            <Space>
              <Switch
                checked={showMinimap}
                onChange={setShowMinimap}
              />
              <span>显示小地图</span>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title="代码编辑器" style={{ marginBottom: '20px' }}>
        <CodeEditor
          ref={editorRef}
          value={code}
          language={language}
          theme={theme}
          readOnly={readOnly}
          showLineNumbers={showLineNumbers}
          showMinimap={showMinimap}
          fontSize={fontSize}
          height={height}
          placeholder="请输入代码..."
          onChange={handleCodeChange}
          onMount={handleEditorMount}
          onValidate={handleValidation}
          style={{ border: '1px solid #d9d9d9', borderRadius: '6px' }}
        />
      </Card>

      <Card title="编辑器操作">
        <Space wrap>
          <Button onClick={handleFormatCode}>格式化代码</Button>
          <Button onClick={handleGoToLine}>跳转到行</Button>
          <Button onClick={handleInsertCode}>插入代码</Button>
          <Button onClick={handleGetSelectedCode}>获取选中代码</Button>
          <Button onClick={() => editorRef.current?.undo()}>撤销</Button>
          <Button onClick={() => editorRef.current?.redo()}>重做</Button>
          <Button onClick={() => editorRef.current?.focus()}>聚焦编辑器</Button>
        </Space>
      </Card>

      <Card title="当前代码内容" style={{ marginTop: '20px' }}>
        <Input.TextArea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={6}
          placeholder="在这里编辑代码，会同步到编辑器"
        />
      </Card>
    </div>
  );
};

export default CodeEditorExample;
