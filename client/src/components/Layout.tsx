import React from 'react';
import Navigation from '@/components/Navigation';
import LiveScoresTicker from '@/components/LiveScoresTicker';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: 'max-w-5xl' | 'max-w-7xl' | 'full';
  hideFooter?: boolean;
  hideNavigation?: boolean;
  bgClassName?: string;
  mainPadding?: string;
  containerPadding?: string;
  beforeContainer?: React.ReactNode;
  mainClassName?: string;
}

export default function Layout({
  children,
  maxWidth = 'max-w-7xl',
  hideFooter = false,
  hideNavigation = false,
  bgClassName = 'bg-background',
  mainPadding = 'pt-4 pb-12',
  containerPadding = 'px-4 sm:px-6 lg:px-8',
  beforeContainer,
  mainClassName,
}: LayoutProps) {
  const containerWidth = maxWidth === 'full' ? '' : maxWidth;

  return (
    <div className={cn('min-h-screen', bgClassName)}>
      {!hideNavigation && <Navigation />}
      {!hideNavigation && <div className="pt-16 bg-slate-900"><LiveScoresTicker /></div>}

      {beforeContainer}

      <main className={cn(mainPadding, mainClassName)}>
        <div className={cn(containerWidth, 'mx-auto', containerPadding)}>
          {children}
        </div>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}
