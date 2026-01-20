import React, { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
}

export const Button: React.FC<Props> = ({ children, variant = 'primary', icon, className, ...props }) => {
  const base = "h-10 px-4 text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm whitespace-nowrap";
  const styles = {
    primary: "bg-gradient-to-r from-[#FF4D67] via-[#FF2D92] to-[#FF914D] hover:opacity-90 text-white border-0 shadow-md",
    secondary: "theme-bg-hover theme-text-main hover:brightness-110",
    ghost: "bg-transparent theme-bg-hover text-[#FF2D92] hover:bg-opacity-10"
  };

  return (
    <button className={`${base} ${styles[variant]} ${className || ''}`} {...props}>
      {children}
      {icon && <span>{icon}</span>}
    </button>
  );
};