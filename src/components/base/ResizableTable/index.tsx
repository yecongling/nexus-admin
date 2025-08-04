import { Table, type TableColumnType, type TableProps } from 'antd';
import { useState } from 'react';
import { Resizable, type ResizeCallbackData } from 'react-resizable';
import './resizeableTable.scss';

interface TitlePropsType {
  width: number;
  onResize: (e: React.SyntheticEvent<Element>, data: ResizeCallbackData) => void;
}

/**
 * 可调整宽度的表格标题
 */
const ResizableTitle: React.FC<Readonly<React.HTMLAttributes<any> & TitlePropsType>> = (props) => {
  const { width, onResize, ...rest } = props;
  if (!width) {
    return <th {...rest} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={<span className="react-resizable-handle" onClick={(e) => e.stopPropagation()} />}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...rest} />
    </Resizable>
  );
};

/**
 * 可调整宽度的表格
 */
const ResizableTable: React.FC<TableProps<any>> = (props) => {
  const [resizableColumns, setResiableColumns] = useState<TableColumnType[]>(props.columns || []);

  /**
   * 调整宽度
   */
  const handleResize =
    (index: number) =>
    (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
      const newColumns = props.columns ? [...props.columns] : [];
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      };
      setResiableColumns(newColumns);
    };

  /**
   * 合并列
   */
  const mergedColumns = resizableColumns.map((col, index) => ({
    ...col,
    onHeaderCell: (column: any) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  return (
    <Table
      {...props}
      columns={mergedColumns}
      components={{
        header: {
          cell: ResizableTitle,
        },
      }}
    />
  );
};
export default ResizableTable;
