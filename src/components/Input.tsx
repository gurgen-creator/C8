import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-white">{label}</label>
      <input 
        className="px-3 py-2 bg-deep-blue border border-neon-cyan/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
        {...props}
      />
    </div>
  );
};
