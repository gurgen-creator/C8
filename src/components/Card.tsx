import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg border border-neon-cyan/20 ${className}`}>
      {children}
    </div>
  );
};
