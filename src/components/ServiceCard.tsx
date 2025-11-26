// Imports de tipos y componentes
import { Service } from '../types';
import { Card, CardBody } from './design-system/Card';
import { Badge } from './design-system/Badge';
import { MapPin, Calendar, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Props del componente ServiceCard
 * @interface ServiceCardProps
 * @property {Service} service - Objeto con la información completa del servicio
 */
interface ServiceCardProps {
  service: Service;
}

/**
 * Componente que renderiza una tarjeta con la información resumida de un servicio
 * Usado en el listado de servicios para mostrar vista previa y permitir navegación al detalle
 *
 * @param {ServiceCardProps} props - Props del componente
 * @returns {JSX.Element} Tarjeta clickeable con información del servicio
 */
export function ServiceCard({ service }: ServiceCardProps) {
  // Hook de React Router para navegación programática
  const navigate = useNavigate();

  // Mapeo de estados técnicos a etiquetas legibles para el usuario
  // Facilita internacionalización futura y mantiene consistencia en la UI
  const statusLabels = {
    publicado: 'Publicado',
    en_evaluacion: 'En Evaluación',
    asignado: 'Asignado',
    completado: 'Completado',
    cancelado: 'Cancelado'
  };

  // Mapeo de categorías técnicas a nombres con tildes y formato correcto
  // Record<string, string> permite categorías adicionales sin errores de tipo
  const categoryLabels: Record<string, string> = {
    jardineria: 'Jardinería',
    piscinas: 'Piscinas',
    limpieza: 'Limpieza',
    otros: 'Otros'
  };

  return (
    // Card con efecto hover y navegación al hacer click
    // hoverable aplica estilos de transición y cursor pointer
    <Card hoverable onClick={() => navigate(`/servicios/${service.id}`)}>
      <CardBody>
        {/* Header: Título y badge de estado */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="flex-1 text-slate-900">{service.title}</h3>
          {/* Badge con variante dinámica según el estado del servicio */}
          <Badge variant={service.status}>
            {statusLabels[service.status]}
          </Badge>
        </div>

        {/* Descripción truncada a 2 líneas con line-clamp */}
        <p className="text-slate-600 mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Metadata del servicio: categoría, ubicación y fecha */}
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          {/* Categoría con fallback si no existe en el mapeo */}
          <div className="flex items-center gap-1.5">
            <Tag className="w-4 h-4" />
            {categoryLabels[service.category] || service.category}
          </div>
          {/* Ciudad */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {service.city}
          </div>
          {/* Fecha formateada en español de Chile */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(service.preferredDate).toLocaleDateString('es-CL')}
          </div>
        </div>

        {/* Footer: Información del solicitante */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
          Solicitante: {service.solicitanteName}
        </div>
      </CardBody>
    </Card>
  );
}
