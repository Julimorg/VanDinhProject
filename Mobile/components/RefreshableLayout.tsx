import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl } from 'react-native';

interface RefreshableLayoutProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
}

export function RefreshableLayout({ children, onRefresh }: RefreshableLayoutProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      // Hoặc reload toàn bộ app data
      // await refetchAllData();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#000000']}
          tintColor="#000000"
          title="Đang tải..."
          titleColor="#666666"
        />
      }
    >
      {children}
    </ScrollView>
  );
}