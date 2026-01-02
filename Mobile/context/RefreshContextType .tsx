
import React, { createContext, useContext, useState, useCallback } from 'react';

interface RefreshContextType {
  refreshApp: () => Promise<void>;
  isRefreshing: boolean;
  // Bạn có thể thêm refetch functions riêng nếu cần
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshApp = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Ở đây bạn sẽ gọi các refetch từ các query chính của app
      // Ví dụ: refetch supplier, product, profile, cart...
      // Tạm thời log để test
      console.log('Đang refresh toàn bộ app...');

      // TODO: Sau này thêm:
      // await queryClient.refetchQueries({ queryKey: ['suppliers'] });
      // await queryClient.refetchQueries({ queryKey: ['products'] });
      // await queryClient.invalidateQueries(...);

    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <RefreshContext.Provider value={{ refreshApp, isRefreshing }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within RefreshProvider');
  }
  return context;
}