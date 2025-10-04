import { useState, useEffect } from 'react';
import moment from 'moment-timezone';


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

//tach chuoi
export const parseCurrency = (value: string): number => {
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

// Format thời gian ISO sang giờ Việt Nam (UTC+7)
export const formatToVietnamTime = (isoString: string | null | undefined): string => {
  if (!isoString) return 'Chưa có';
  try {
    return moment(isoString).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY - HH:mm:ss');
  } catch (error) {
    console.error('Lỗi khi format thời gian:', error);
    return 'Lỗi thời gian';
  }
};