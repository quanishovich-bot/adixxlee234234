import React from 'react';

export function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-[#141418] border border-[#222228] rounded-2xl p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
