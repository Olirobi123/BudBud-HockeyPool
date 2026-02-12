import React from 'react';
import { Link } from 'react-router-dom';
import logoIcon from '@/images/icon-blanc.png';

export const NavigationLogo: React.FC = () => (
  <Link to="/" className="group flex items-center gap-2.5">
    <img
      src={logoIcon}
      alt="38BudBud"
      className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
    />
    <span className="font-display text-xl font-bold tracking-wide text-white">
      38
      <span className="text-cyan-400">BUD</span>
      BUD
    </span>
  </Link>
);
