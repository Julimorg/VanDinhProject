import React, { createContext, useContext, useState, useCallback } from 'react';

interface RefreshContextType {
  refreshApp: () => Promise<void>;
  isRefreshing: boolean;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshApp = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // TODO: Thêm các API calls để reload data
      await Promise.all([
        // fetchCompanyData(),
        // fetchProductsData(),
        // fetchUserProfile(),
        // ... thêm các fetch functions khác
      ]);
      
      console.log('App refreshed successfully');
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