import { useState, useEffect } from 'react';
import moment from 'moment-timezone';



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

//? Build Form Data
export const buildFormData = (data: Record<string, any>): FormData => {
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


export const buildFormDataForExtaSpec = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === 'productImage' && Array.isArray(value)) {
      (value as File[]).forEach((file) => formData.append('productImage', file));
      return;
    }

    // Map field (extraSpecs) — Spring WebDataBinder hỗ trợ sẵn cú pháp
    // key[subKey]=value để bind vào Map<String, Object>, không cần Jackson.
    if (typeof value === 'object' && !(value instanceof File) && !Array.isArray(value)) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (subValue !== undefined && subValue !== null) {
          formData.append(`${key}[${subKey}]`, String(subValue));
        }
      });
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};
/**
 * Download CSV file from base64 string
 * @param base64String - Base64 encoded file content
 * @param fileName - Name of the file to download
 */
export const downloadCsvFromBase64 = (base64String: string, fileName: string): void => {
  try {
    // Decode base64 to binary string
    const binaryString = atob(base64String);
    
    // Convert binary string to byte array
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Create Blob from byte array
    const blob = new Blob([bytes], { type: 'text/csv;charset=utf-8;' });
    
    // Create download URL
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CSV file:', error);
    throw new Error('Failed to download CSV file');
  }
};

export const downloadBinaryFromBase64 = (
  base64: string,
  fileName: string,
  mimeType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Format file size to readable string
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate CSV file before upload
 * @param file - File to validate
 * @returns Validation result
 */
export const validateCsvFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.name.endsWith('.csv')) {
    return { valid: false, error: 'Chỉ chấp nhận file CSV!' };
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File vượt quá kích thước cho phép (10MB)!' };
  }
  
  // Check if file is empty
  if (file.size === 0) {
    return { valid: false, error: 'File CSV trống!' };
  }
  
  return { valid: true };
};



// Utils/downloadJsonTemplate.ts
export const downloadJsonTemplate = (data: unknown, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};