import React from 'react';
import { Link } from 'react-router-dom';
import logoIcon from '@/images/icon-blanc.png';

export const NavigationLogo: React.FC = () => (
  <Link to="/" className="group flex items-center gap-2.5">
    {/*
      The source asset is a pure-white monochrome mark (every opaque pixel is
      #FFFFFF), so it is invisible on the light shell. `invert` renders it
      pure black — no second asset required.
    */}
    <img
      src={logoIcon}
      alt="38BudBud"
      className="h-8 w-8 invert transition-transform duration-300 group-hover:scale-110"
    />
    <span className="font-display text-xl font-bold tracking-wide text-foreground">
      38BUDBUD
    </span>
  </Link>
);
