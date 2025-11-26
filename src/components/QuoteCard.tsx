// Imports de tipos y componentes
import { Quote } from '../types';
import { Card, CardBody } from './design-system/Card';
import { Button } from './design-system/Button';
import { Star, Clock, DollarSign, CheckCircle2, Trash2, Edit } from 'lucide-react';
import { Badge } from './design-system/Badge';
import { useState } from 'react';

/**
 * Props del componente QuoteCard
 * Diseñado con props opcionales para permitir reutilización en múltiples contextos
 *
 * @interface QuoteCardProps
 * @property {Quote} quote - Objeto con la información de la cotización
 * @property {boolean} [isSelected] - Indica si esta cotización fue seleccionada por el solicitante
 * @property {boolean} [canSelect] - Habilita el botón de seleccionar (para solicitantes)
 * @property {function} [onSelect] - Callback al seleccionar una cotización
 * @property {boolean} [canDelete] - Habilita el botón de eliminar (para proveedores)
 * @property {function} [onDelete] - Callback al eliminar una cotización
 * @property {boolean} [canEdit] - Habilita el botón de editar (para proveedores)
 * @property {function} [onEdit] - Callback al editar una cotización
 */
interface QuoteCardProps {
  quote: Quote;
  isSelected?: boolean;
  canSelect?: boolean;
  onSelect?: (quoteId: string) => void;
  canDelete?: boolean;
  onDelete?: (quoteId: string) => void;
  canEdit?: boolean;
  onEdit?: (quoteId: string) => void;
}

/**
 * Componente que renderiza una tarjeta con la información de una cotización
 * Soporta múltiples modos de operación según el rol del usuario:
 * - Solicitante: puede ver y seleccionar cotizaciones
 * - Proveedor: puede ver, editar y eliminar sus propias cotizaciones
 * - Vista de solo lectura: sin acciones disponibles
 *
 * @param {QuoteCardProps} props - Props del componente
 * @returns {JSX.Element} Tarjeta con información de la cotización y acciones contextuales
 */
export function QuoteCard({ quote, isSelected, canSelect, onSelect, canDelete, onDelete, canEdit, onEdit }: QuoteCardProps) {
  return (
    // Card con ring verde si está seleccionada (feedback visual claro)
    <Card className={isSelected ? 'ring-2 ring-emerald-500' : ''}>
      <CardBody>
        {/* Badge de cotización seleccionada - solo visible si isSelected es true */}
        {isSelected && (
          <div className="mb-3">
            <Badge variant="success">
              <CheckCircle2 className="w-3 h-3" />
              Cotización Seleccionada
            </Badge>
          </div>
        )}

        {/* Header: Nombre del proveedor y fecha de creación */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-slate-900 mb-1">{quote.providerName}</h4>
            {/* Fecha formateada en español de Chile */}
            <p className="text-xs text-slate-500">
              Enviada el {new Date(quote.createdAt).toLocaleDateString('es-CL')}
            </p>
          </div>
        </div>

        {/* Grid 2 columnas: Precio y Plazo de entrega */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Precio con formato de moneda chilena */}
          <div className="flex items-center gap-2 text-slate-600">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-xs text-slate-500">Precio</p>
              <p className="text-slate-900">
                ${quote.price.toLocaleString('es-CL')}
              </p>
            </div>
          </div>
          {/* Plazo con pluralización correcta (día/días) */}
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-slate-500">Plazo</p>
              <p className="text-slate-900">
                {quote.deadline} {quote.deadline === 1 ? 'día' : 'días'}
              </p>
            </div>
          </div>
        </div>

        {/* Detalles de la cotización en un área destacada */}
        <div className="p-3 bg-slate-50 rounded-lg mb-4">
          <p className="text-sm text-slate-600">{quote.details}</p>
        </div>

        {/* Sección de acciones - renderizado condicional según permisos */}
        {/* Solo se muestra si al menos una acción está habilitada */}
        {(canSelect || canDelete || canEdit) && (
          <div className="flex gap-2 pt-4 border-t border-slate-200">
            {/* Botón Seleccionar: solo visible si canSelect es true, hay callback y NO está seleccionada */}
            {canSelect && onSelect && !isSelected && (
              <Button
                fullWidth
                size="sm"
                onClick={() => onSelect(quote.id)}
              >
                <CheckCircle2 className="w-4 h-4" />
                Seleccionar
              </Button>
            )}
            {/* Botón Editar: solo visible si canEdit es true y hay callback */}
            {/* fullWidth dinámico: solo si es la única acción disponible */}
            {canEdit && onEdit && (
              <Button
                fullWidth={!canSelect && !canDelete}
                size="sm"
                variant="outline"
                onClick={() => onEdit(quote.id)}
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            )}
            {/* Botón Eliminar: solo visible si canDelete es true y hay callback */}
            {/* Variante "danger" para acciones destructivas */}
            {canDelete && onDelete && (
              <Button
                fullWidth={!canSelect && !canEdit}
                size="sm"
                variant="danger"
                onClick={() => onDelete(quote.id)}
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}