import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  color?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  className = 'w-5 h-5',
  color,
  size,
}) => {
  // Try to find icon in Lucide
  const IconComponent = (Icons as any)[name] || Icons.CircleDollarSign;

  return <IconComponent className={className} style={color ? { color } : undefined} size={size} />;
};

export const AVAILABLE_CATEGORY_ICONS = [
  'ShoppingBag',
  'Briefcase',
  'FileText',
  'TrendingUp',
  'PlusCircle',
  'Truck',
  'Users',
  'Home',
  'Zap',
  'Wifi',
  'Megaphone',
  'Receipt',
  'Laptop',
  'Wrench',
  'Car',
  'Calculator',
  'CreditCard',
  'DollarSign',
  'Package',
  'Coffee',
  'ShieldCheck',
  'Phone',
  'Gift',
  'HeartPulse',
  'Cpu',
  'Layers',
];
