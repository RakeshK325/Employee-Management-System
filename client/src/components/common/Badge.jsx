import React from 'react';

/**
 * Enterprise status badge with restrained, muted palettes.
 */
export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const baseStyles = 'inline-flex items-center font-medium rounded tracking-normal transition-colors';

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[11px] leading-tight',
    sm: 'px-2 py-0.5 text-xs leading-normal',
    md: 'px-2.5 py-1 text-xs leading-normal',
  };

  const variantStyles = {
    default: 'bg-[#F2F3F0] text-[#4F5551] border border-[#DFE2DE]',
    success: 'bg-[#EEF3EF] text-[#344E3B] border border-[#D5E2D8]',
    warning: 'bg-[#FAF6EC] text-[#786128] border border-[#EFE5C6]',
    neutral: 'bg-[#F5F5F2] text-[#404541] border border-[#E3E3DC]',
    forest: 'bg-[#54745D]/10 text-[#3E5645] border border-[#54745D]/25',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size] || sizeStyles.sm} ${variantStyles[variant] || variantStyles.default} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

