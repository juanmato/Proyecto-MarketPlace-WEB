import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardBody, CardHeader } from '../components/design-system/Card';
import { Button } from '../components/design-system/Button';
import { Badge } from '../components/design-system/Badge';
import { EmptyState } from '../components/design-system/EmptyState';
import { FileText, Trash2, Eye, DollarSign, Clock, Star } from 'lucide-react';
import { toast } from 'sonner';

export function MisCotizaciones() {
  const { user } = useAuth();
  const { quotes, services, deleteQuote } = useData();
  const navigate = useNavigate();

  const myQuotes = quotes.filter(q => q.providerId === user?.id);

  if (user?.role !== 'proveedor_servicio') {
    navigate('/');
    return null;
  }

  const handleDelete = (quoteId: string, servicioStatus: string) => {
    // Solo se puede eliminar si el servicio está en Publicado o En Evaluación
    if (servicioStatus !== 'publicado' && servicioStatus !== 'en_evaluacion') {
      toast.error('No se puede eliminar esta cotización porque el servicio ya fue asignado o completado');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
      deleteQuote(quoteId);
      toast.success('Cotización eliminada correctamente');
    }
  };

  const getService = (serviceId: string) => {
    return services.find(s => s.id === serviceId);
  };

  const statusLabels = {
    pendiente: 'Pendiente',
    aceptada: 'Aceptada',
    rechazada: 'Rechazada'
  };

  const statusColors: Record<string, any> = {
    pendiente: 'warning',
    aceptada: 'success',
    rechazada: 'danger'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Mis Cotizaciones</h1>
        <p className="text-slate-600">
          Administra todas las cotizaciones que has enviado
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Enviadas</p>
                <p className="text-2xl text-slate-900">{myQuotes.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pendientes</p>
                <p className="text-2xl text-slate-900">
                  {myQuotes.filter(q => q.status === 'pendiente').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Aceptadas</p>
                <p className="text-2xl text-slate-900">
                  {myQuotes.filter(q => q.status === 'aceptada').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Cotizaciones List */}
      {myQuotes.length > 0 ? (
        <div className="space-y-4">
          {myQuotes.map((quote) => {
            const service = getService(quote.serviceId);
            if (!service) return null;

            const canDelete = service.status === 'publicado' || service.status === 'en_evaluacion';

            return (
              <Card key={quote.id}>
                <CardBody>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Service Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={statusColors[quote.status]}>
                          {statusLabels[quote.status]}
                        </Badge>
                        <Badge variant={service.status}>
                          Servicio: {service.status}
                        </Badge>
                      </div>
                      <h3 className="mb-1">{service.title}</h3>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-1">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${quote.price.toLocaleString('es-CL')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {quote.deadline} {quote.deadline === 1 ? 'día' : 'días'}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/servicios/${service.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                        Ver Servicio
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(quote.id, service.status)}
                        disabled={!canDelete}
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>

                  {/* Quote Details */}
                  {quote.details && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium text-slate-900">Detalle:</span> {quote.details}
                      </p>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-slate-400">
                    Enviada el {new Date(quote.createdAt).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No has enviado cotizaciones"
          description="Cuando envíes cotizaciones a servicios, aparecerán aquí."
          action={
            <Button onClick={() => navigate('/servicios')}>
              Ver Servicios Disponibles
            </Button>
          }
        />
      )}
    </div>
  );
}