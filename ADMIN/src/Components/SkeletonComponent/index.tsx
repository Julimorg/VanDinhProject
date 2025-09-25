import React, { memo } from 'react';

const SkeletonComponent = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="flex gap-4">
      <div className="w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin" />
      <div className="w-12 h-12 border-t-4 border-green-500 rounded-full animate-spin animation-delay-200" />
      <div className="w-12 h-12 border-t-4 border-red-500 rounded-full animate-spin animation-delay-400" />
    </div>
    <p className="mt-4 text-xl font-semibold">Loading...</p>
  </div>
);

export default memo(SkeletonComponent);
