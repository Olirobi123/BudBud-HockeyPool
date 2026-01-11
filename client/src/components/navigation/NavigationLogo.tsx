import React from 'react';
import { Link } from 'wouter';

export const NavigationLogo: React.FC = () => (
  <Link href="/">
    <div className="flex items-center space-x-2 cursor-pointer">
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">38</span>
      </div>
      <h1 className="text-xl font-bold text-white">38BudBud</h1>
    </div>
  </Link>
);
