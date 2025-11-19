import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { STATUS_MAP, type UserStatus } from '../Enum/UserStatus';



export const removeDiacritics = (str: string): string => {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/đ/g, 'd').replace(/Đ/g, 'D') 
    .toLowerCase();
};

export const cutStringOnThirdChar = (name: string) => {
    const cutString = name.substring(0,2);
    const upperString = cutString.toLocaleUpperCase();
    return upperString.toString();
}

export const useCurrentTime = () => {
  const [time, setTime] = useState(moment().tz('Asia/Ho_Chi_Minh').format('YYYY/MM/DD - HH:mm:ss'));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().tz('Asia/Ho_Chi_Minh').format('YYYY/MM/DD - HH:mm:ss'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
};

//? Convert num thành VNĐ
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

//? tach chuoi
export const parseCurrency = (value: string | undefined): number => {
  if (!value) return 0;
  return parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
};

export const getformatDateWithoutMin = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };


export const getFormattedTime = (): string => {
  const now = new Date();
  const vietnamTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));

  return vietnamTime.toLocaleString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

//? Format thời gian ISO sang giờ Việt Nam (UTC+7)
export const formatToVietnamTime = (isoString: string | null | undefined): string => {
  if (!isoString) return 'Chưa có';
  try {
    
    const utcTime = moment.utc(isoString);  
    const vnTime = utcTime.tz('Asia/Ho_Chi_Minh');
    return vnTime.format('DD/MM/YYYY - HH:mm:ss');
  } catch (error) {
    console.error('Lỗi khi format thời gian:', error);
    return 'Lỗi thời gian';
  } 
};

//? User Status Converter
export const getUserStatusText = (status: UserStatus): string => {
  return STATUS_MAP[status] || 'Không xác định';
};

//? Build Form Data
export const buildFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;  
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));  
    } else if (value instanceof File) {
      formData.append(key, value);  // Handle file
    } else if (typeof value === 'object' && value.toString) {
      formData.append(key, value.toString());  
    } else {
      formData.append(key, value.toString());
    }
  });
  return formData;
};


/*
 * Stock status configuration
 */
export const STOCK_THRESHOLDS = {
  OUT_OF_STOCK: 0,
  VERY_LOW: 5,
  LOW: 20,
} as const;

/*
 * Stock status type
 */
export type StockStatus = {
  text: string;
  color: string;
  level: 'out' | 'very-low' | 'low' | 'normal';
};

/*
 * Get stock status based on quantity
 */
export const getStockStatus = (quantity: number): StockStatus | null => {
  if (quantity === STOCK_THRESHOLDS.OUT_OF_STOCK) {
    return {
      text: 'Hết hàng',
      color: 'bg-gray-900',
      level: 'out',
    };
  }
  
  if (quantity < STOCK_THRESHOLDS.VERY_LOW) {
    return {
      text: 'Gần hết',
      color: 'bg-red-600',
      level: 'very-low',
    };
  }
  
  if (quantity < STOCK_THRESHOLDS.LOW) {
    return {
      text: 'Sắp hết',
      color: 'bg-gray-700',
      level: 'low',
    };
  }
  
  return null;
};

  /*
  * Check if product is out of stock
  */
export const isOutOfStock = (quantity: number): boolean => {
  return quantity === STOCK_THRESHOLDS.OUT_OF_STOCK;
};

/*
 * Check if product has low stock
 */
export const isLowStock = (quantity: number): boolean => {
  return quantity > STOCK_THRESHOLDS.OUT_OF_STOCK && quantity < STOCK_THRESHOLDS.LOW;
};

/*
 * Check if product has very low stock
 */
export const isVeryLowStock = (quantity: number): boolean => {
  return quantity > STOCK_THRESHOLDS.OUT_OF_STOCK && quantity < STOCK_THRESHOLDS.VERY_LOW;
};

/*
 * Get stock display text
 */
export const getStockDisplayText = (quantity: number): string => {
  if (isOutOfStock(quantity)) {
    return 'Hết hàng';
  }
  
  if (isVeryLowStock(quantity)) {
    return `Chỉ còn ${quantity} sản phẩm`;
  }
  
  return `Còn ${quantity} sản phẩm`;
};

/*
 * Validate and adjust quantity input
 */
export const validateQuantity = (
  inputValue: number,
  maxQuantity: number
): { value: number; warning?: string } => {
  let value = inputValue;
  let warning: string | undefined;

  //? Minimum is 1
  if (value < 1) {
    value = 1;
  }

  //? Maximum is available stock
  if (value > maxQuantity) {
    value = maxQuantity;
    warning = `Chỉ còn ${maxQuantity} sản phẩm!`;
  }

  return { value, warning };
};

/*
 * Format price with currency
 */
export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/*
 * Get product availability message
 */
export const getAvailabilityMessage = (quantity: number): string => {
  if (isOutOfStock(quantity)) {
    return 'Sản phẩm này hiện tại đã hết hàng';
  }
  
  if (isVeryLowStock(quantity)) {
    return `Nhanh tay! Chỉ còn ${quantity} sản phẩm`;
  }
  
  if (isLowStock(quantity)) {
    return 'Số lượng có hạn';
  }
  
  return 'Còn hàng';
};

/*
 * Check if user can add to cart
 */
export const canAddToCart = (quantity: number): boolean => {
  return !isOutOfStock(quantity);
};

/*
 * Get stock badge props
 */
export const getStockBadgeProps = (quantity: number) => {
  const status = getStockStatus(quantity);
  
  if (!status) return null;
  
  return {
    text: status.text,
    className: `${status.color} text-white text-xs font-medium px-2 py-1 rounded`,
    level: status.level,
  };
};

/*
 * Calculate max quantity that can be added to cart
 * This can include business logic like max order per customer
 */
export const getMaxOrderQuantity = (
  availableQuantity: number,
  maxPerOrder: number = 99
): number => {
  return Math.min(availableQuantity, maxPerOrder);
};

/*
 * Common product card configuration
 */
export const PRODUCT_CARD_CONFIG = {
  //? Image heights
  imageHeight: {
    grid: 'h-56',
    list: {
      mobile: 'aspect-square',
      desktop: 'md:aspect-auto md:h-52 lg:h-56',
    },
  },
  
  //? Text sizes
  textSize: {
    grid: {
      title: 'text-sm',
      price: 'text-xl',
    },
    list: {
      title: 'text-base lg:text-lg',
      price: 'text-2xl lg:text-3xl',
    },
  },
  
  //? Button heights
  buttonHeight: 'h-9',
  
  //? Animation durations
  transitionDuration: 'duration-300',
} as const;