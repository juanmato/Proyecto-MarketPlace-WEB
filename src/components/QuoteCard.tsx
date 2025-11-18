import { Quote } from '../types';
import { Card, CardBody } from './design-system/Card';
import { Button } from './design-system/Button';
import { Star, Clock, DollarSign, CheckCircle2, Trash2, Edit } from 'lucide-react';
import { Badge } from './design-system/Badge';
import { useState } from 'react';

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

export function QuoteCard({ quote, isSelected, canSelect, onSelect, canDelete, onDelete, canEdit, onEdit }: QuoteCardProps) {
  return (
    <Card className={isSelected ? 'ring-2 ring-emerald-500' : ''}>
      <CardBody>
        {isSelected && (
          <div className="mb-3">
            <Badge variant="success">
              <CheckCircle2 className="w-3 h-3" />
              Cotización Seleccionada
            </Badge>
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-slate-900 mb-1">{quote.providerName}</h4>
            <p className="text-xs text-slate-500">
              Enviada el {new Date(quote.createdAt).toLocaleDateString('es-CL')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-slate-600">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-xs text-slate-500">Precio</p>
              <p className="text-slate-900">
                ${quote.price.toLocaleString('es-CL')}
              </p>
            </div>
          </div>
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

        <div className="p-3 bg-slate-50 rounded-lg mb-4">
          <p className="text-sm text-slate-600">{quote.details}</p>
        </div>

        {/* Actions */}
        {(canSelect || canDelete || canEdit) && (
          <div className="flex gap-2 pt-4 border-t border-slate-200">
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