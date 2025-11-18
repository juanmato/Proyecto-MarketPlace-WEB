import { Service } from '../types';
import { Card, CardBody } from './design-system/Card';
import { Badge } from './design-system/Badge';
import { MapPin, Calendar, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const navigate = useNavigate();

  const statusLabels = {
    publicado: 'Publicado',
    en_evaluacion: 'En Evaluación',
    asignado: 'Asignado',
    completado: 'Completado',
    cancelado: 'Cancelado'
  };

  const categoryLabels: Record<string, string> = {
    jardineria: 'Jardinería',
    piscinas: 'Piscinas',
    limpieza: 'Limpieza',
    otros: 'Otros'
  };

  return (
    <Card hoverable onClick={() => navigate(`/servicios/${service.id}`)}>
      <CardBody>
        <div className="flex items-start justify-between mb-3">
          <h3 className="flex-1 text-slate-900">{service.title}</h3>
          <Badge variant={service.status}>
            {statusLabels[service.status]}
          </Badge>
        </div>

        <p className="text-slate-600 mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <Tag className="w-4 h-4" />
            {categoryLabels[service.category] || service.category}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {service.city}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(service.preferredDate).toLocaleDateString('es-CL')}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
          Solicitante: {service.solicitanteName}
        </div>
      </CardBody>
    </Card>
  );
}
