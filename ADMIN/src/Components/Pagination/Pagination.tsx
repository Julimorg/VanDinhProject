import { Pagination } from 'antd';

interface CommonPaginationProps {
  /**
   * Current page from backend (0-based index)
   */
  current: number;
  
  /**
   * Total number of items
   */
  total: number;
  
  /**
   * Number of items per page
   */
  pageSize: number;
  
  /**
   * Callback when page or pageSize changes
   * @param page - Backend page number (0-based)
   * @param pageSize - Number of items per page
   */
  onChange: (page: number, pageSize: number) => void;
  
  /**
   * Available page size options
   * @default ['5', '10', '15', '20']
   */
  pageSizeOptions?: string[];
  
  /**
   * Show size changer
   * @default true
   */
  showSizeChanger?: boolean;
  
  /**
   * Show quick jumper
   * @default true
   */
  showQuickJumper?: boolean;
  
  /**
   * Custom text for showing total
   * @default 'items'
   */
  totalText?: string;
  
  /**
   * Whether to show total info
   * @default true
   */
  showTotal?: boolean;
  
  /**
   * Custom className for the wrapper
   */
  className?: string;
  
  /**
   * Align pagination
   * @default 'center'
   */
  align?: 'left' | 'center' | 'right';
}

const CommonPagination: React.FC<CommonPaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  pageSizeOptions = ['5', '10', '15', '20'],
  showSizeChanger = true,
  showQuickJumper = true,
  totalText = 'items',
  showTotal: showTotalProp = true,
  className = '',
  align = 'center',
}) => {
  const handleChange = (page: number, newPageSize: number) => {

    onChange(page - 1, newPageSize);
  };

  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[align];

  return (
    <div className={`mt-6 flex ${alignmentClass} ${className}`}>
      <Pagination
        current={current + 1} 
        total={total}
        pageSize={pageSize}
        onChange={handleChange}
        showSizeChanger={showSizeChanger}
        showQuickJumper={showQuickJumper}
        pageSizeOptions={pageSizeOptions}
        showTotal={
          showTotalProp
            ? (total, range) => `${range[0]}-${range[1]} of ${total} ${totalText}`
            : undefined
        }
      />
    </div>
  );
};

export default CommonPagination;