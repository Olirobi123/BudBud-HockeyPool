import React from 'react';
import { Link } from 'wouter';
import logoIcon from '@/images/icon-blanc.png';

export const NavigationLogo: React.FC = () => (
  <Link href="/">
    <div className="flex items-center space-x-2 cursor-pointer">
      <img src={logoIcon} alt="38BudBud" className="w-8 h-8" />
      <h1 className="text-xl font-bold text-white">38BudBud</h1>
    </div>
  </Link>
);
