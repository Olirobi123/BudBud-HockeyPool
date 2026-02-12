import React from 'react';
import {
  Trophy, Users, ArrowLeftRight, TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  external?: boolean;
  accentColor: string;
  iconBg: string;
}

const actions: QuickAction[] = [
  {
    icon: Trophy,
    label: 'Classement',
    to: '/equipes',
    accentColor: 'group-hover:border-amber-400/30',
    iconBg: 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20',
  },
  {
    icon: Users,
    label: 'Repêchage',
    to: '/draft',
    accentColor: 'group-hover:border-cyan-400/30',
    iconBg: 'bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500/20',
  },
  {
    icon: ArrowLeftRight,
    label: 'Échanges',
    to: '/echanges',
    accentColor: 'group-hover:border-blue-400/30',
    iconBg: 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20',
  },
  {
    icon: TrendingUp,
    label: 'Marqueur',
    to: 'https://www.marqueur.com/hockey/mbr/tools/pool/index.php?nyx=190707',
    external: true,
    accentColor: 'group-hover:border-emerald-400/30',
    iconBg: 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20',
  },
];

function ActionCard({ action }: { action: QuickAction }) {
  const content = (
    <div className={`group flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:shadow-md cursor-pointer transition-all duration-200 ${action.accentColor}`}>
      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 ${action.iconBg}`}>
        <action.icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium text-foreground group-hover:text-foreground/90">
        {action.label}
      </span>
    </div>
  );

  if (action.external === true) {
    return (
      <a href={action.to} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link to={action.to}>{content}</Link>;
}

export const HomeQuickActions: React.FC = () => (
  <div>
    <div className="flex items-center gap-2 mb-5">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Accès Rapide
      </h3>
    </div>
    <div className="grid grid-cols-1 gap-2">
      {actions.map((action) => (
        <ActionCard key={action.label} action={action} />
      ))}
    </div>
  </div>
);
