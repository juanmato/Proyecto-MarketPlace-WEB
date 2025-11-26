import { LucideIcon } from 'lucide-react';
import { Card, CardBody } from '../design-system/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatCard({ label, value, icon: Icon, iconColor = 'text-blue-600', iconBgColor = 'bg-blue-50' }: StatCardProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">{label}</p>
            <p className="text-2xl text-slate-900">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${iconBgColor} ${iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
