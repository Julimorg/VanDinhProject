

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
