import React from 'react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-2',
    lg: 'h-16 w-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`animate-spin rounded-full border-t-transparent border-violet-500 ${sizeClasses[size] || sizeClasses.md}`}
      />
      {text && <p className="text-sm text-slate-400 font-medium animate-pulse">{text}</p>}
    </div>
  );
}
