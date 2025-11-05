import React from 'react';

// This is a simple wrapper for Lucide icons used via script tag.
// The `lucide.createIcons()` call in the main App component will transform these `<i>` tags into SVGs.
export const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-5 h-5" }) => {
  return <i data-lucide={name} className={className}></i>;
};
