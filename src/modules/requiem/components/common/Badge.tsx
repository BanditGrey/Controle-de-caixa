import React from 'react';
import { 
  CATEGORY_DETAILS, 
  STATUS_DETAILS, 
  PRIORITY_DETAILS, 
  ORIGIN_DETAILS 
} from '../../utils/formatters';
import { AssetCategory, AssetOrigin, AssetStatus, Priority } from '../../types';
import { Flame, ArrowUp, ArrowRight, ArrowDown, Clock, Loader2, CheckCircle2 } from 'lucide-react';

export const CategoryBadge: React.FC<{ category: AssetCategory; size?: 'sm' | 'md' }> = ({ category, size = 'md' }) => {
  const details = CATEGORY_DETAILS[category];
  const sizeCls = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium rounded border uppercase tracking-wider ${sizeCls}`}
      style={{
        backgroundColor: details.badgeBg,
        borderColor: details.badgeBorder,
        color: details.badgeText
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: details.color }} />
      {details.singular}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: AssetStatus; size?: 'sm' | 'md'; interactive?: boolean; onClick?: () => void }> = ({ 
  status, 
  size = 'md',
  interactive = false,
  onClick
}) => {
  const details = STATUS_DETAILS[status];
  const sizeCls = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const renderIcon = () => {
    switch (status) {
      case 'PENDING':
        return <Clock size={12} className="text-[#bdc3c7]" />;
      case 'IN_PROGRESS':
        return <Loader2 size={12} className="text-[#f1c40f] animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle2 size={12} className="text-[#2ecc71]" />;
    }
  };

  return (
    <span 
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-medium rounded border transition-all ${sizeCls} ${
        interactive ? 'cursor-pointer hover:brightness-125' : ''
      }`}
      style={{
        backgroundColor: details.bg,
        borderColor: details.border,
        color: details.textColor
      }}
    >
      {renderIcon()}
      <span>{details.label}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority; size?: 'sm' | 'md'; showLabel?: boolean }> = ({ 
  priority, 
  size = 'md',
  showLabel = true 
}) => {
  const details = PRIORITY_DETAILS[priority];
  const sizeCls = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs';

  const renderIcon = () => {
    switch (priority) {
      case 'CRITICAL':
        return <Flame size={12} className="text-[#e74c3c] animate-pulse" />;
      case 'HIGH':
        return <ArrowUp size={12} className="text-[#f39c12]" />;
      case 'MEDIUM':
        return <ArrowRight size={12} className="text-[#f0d98c]" />;
      case 'LOW':
        return <ArrowDown size={12} className="text-[#95a5a6]" />;
    }
  };

  return (
    <span 
      className={`inline-flex items-center gap-1 font-medium rounded border ${sizeCls}`}
      style={{
        backgroundColor: details.bg,
        borderColor: details.border,
        color: details.textColor
      }}
      title={`Prioridade ${details.label}`}
    >
      {renderIcon()}
      {showLabel && <span>{details.label}</span>}
    </span>
  );
};

export const OriginBadge: React.FC<{ origin: AssetOrigin; size?: 'sm' | 'md' }> = ({ origin, size = 'sm' }) => {
  const details = ORIGIN_DETAILS[origin];
  const sizeCls = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  return (
    <span 
      className={`inline-flex items-center font-mono font-bold rounded border uppercase tracking-wider bg-[#141414] ${sizeCls}`}
      style={{
        borderColor: details.color,
        color: details.color
      }}
    >
      {details.badge}
    </span>
  );
};
