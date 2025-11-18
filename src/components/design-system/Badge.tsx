import { ReactNode } from 'react';
import { ServiceStatus } from '../../types';

interface BadgeProps {
  children: ReactNode;
  variant?: ServiceStatus | 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variants = {
    publicado: 'bg-blue-100 text-blue-700',
    en_evaluacion: 'bg-yellow-100 text-yellow-700',
    asignado: 'bg-purple-100 text-purple-700',
    completado: 'bg-emerald-100 text-emerald-700',
    cancelado: 'bg-red-100 text-red-700',
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
