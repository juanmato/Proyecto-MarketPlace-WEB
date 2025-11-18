import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardBody, CardHeader } from '../components/design-system/Card';
import { Badge } from '../components/design-system/Badge';
import { Button } from '../components/design-system/Button';
import { QuoteCard } from '../components/QuoteCard';
import { EmptyState } from '../components/design-system/EmptyState';
import { RatingModal } from '../components/RatingModal';
import { 
  MapPin, 
  Calendar, 
  User, 
  Tag,
  ArrowLeft,
  Package,
  FileText,
  AlertCircle,
  CheckCircle2,
  Star,
  Edit,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function ServicioDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { services, quotes, insumoPacks, deleteQuote, selectQuote: selectQuoteAction, completeService: completeServiceAction, cancelService: cancelServiceAction } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cotizaciones' | 'insumos'>('cotizaciones');
  const [showRatingModal, setShowRatingModal] = useState(false);

  const service = services.find(s => s.id === id);
  const serviceQuotes = quotes.filter(q => q.serviceId === id);
  const servicePacks = insumoPacks.filter(p => p.serviceId === id);

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon={AlertCircle}
          title="Servicio no encontrado"
          description="El servicio que buscas no existe o fue eliminado."
          action={
            <Button onClick={() => navigate('/servicios')}>
              Volver a Servicios
            </Button>
          }
        />
      </div>
    );
  }

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

  const handleSelectQuote = (quoteId: string) => {
    selectQuoteAction(id!, quoteId);
    toast.success('Cotización seleccionada correctamente');
  };

  const handleCompleteService = () => {
    const selectedQuote = serviceQuotes.find(q => q.id === service?.assignedQuoteId);
    if (selectedQuote) {
      setShowRatingModal(true);
    }
  };

  const handleSubmitRating = (rating: number, comment: string) => {
    completeServiceAction(id!, rating, comment);
    toast.success('¡Gracias por tu calificación!');
    setShowRatingModal(false);
  };

  const handleCancelService = () => {
    if (confirm('¿Estás seguro de que deseas cancelar este servicio? Esta acción no se puede deshacer.')) {
      cancelServiceAction(id!);
      toast.success('Servicio cancelado');
    }
  };

  const handleDeleteQuote = (quoteId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar tu cotización?')) {
      deleteQuote(quoteId);
      toast.success('Cotización eliminada');
    }
  };

  const canQuote = user?.role === 'proveedor_servicio' && 
                   service.status === 'publicado' &&
                   !serviceQuotes.some(q => q.providerId === user.id);

  const canCreatePack = user?.role === 'proveedor_insumos' &&
                        service.status !== 'completado' &&
                        service.status !== 'cancelado';

  const canProposeEquivalencias = user?.role === 'proveedor_insumos' &&
                                  service.status !== 'completado' &&
                                  service.status !== 'cancelado' &&
                                  service.insumos.length > 0;

  const canCompleteService = user?.id === service.solicitanteId && 
                             service.status === 'asignado';

  const canCancelService = user?.id === service.solicitanteId && 
                          (service.status === 'publicado' || service.status === 'en_evaluacion');

  // Check if user can edit their own quote
  const userQuote = serviceQuotes.find(q => q.providerId === user?.id);
  const canEditQuote = userQuote && 
                       (service.status === 'publicado' || service.status === 'en_evaluacion');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/servicios')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant={service.status}>
                      {statusLabels[service.status]}
                    </Badge>
                    <Badge variant="info">
                      {categoryLabels[service.category]}
                    </Badge>
                  </div>
                  <h1 className="mb-2">{service.title}</h1>
                  <p className="text-slate-600">{service.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-500">Ubicación</p>
                    <p className="text-slate-900">{service.address}</p>
                    <p className="text-sm">{service.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-slate-500">Fecha Preferida</p>
                    <p className="text-slate-900">
                      {new Date(service.preferredDate).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <User className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-slate-500">Solicitante</p>
                    <p className="text-slate-900">{service.solicitanteName}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Insumos Requeridos */}
          {service.insumos.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h2>Insumos Requeridos</h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-200">
                      <tr className="text-left">
                        <th className="pb-3 text-slate-600">Nombre</th>
                        <th className="pb-3 text-slate-600">Cantidad</th>
                        <th className="pb-3 text-slate-600">Unidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {service.insumos.map((insumo) => (
                        <tr key={insumo.id}>
                          <td className="py-3 text-slate-900">{insumo.name}</td>
                          <td className="py-3 text-slate-600">{insumo.quantity}</td>
                          <td className="py-3 text-slate-600">{insumo.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Tabs: Cotizaciones / Ofertas de Insumos */}
          <Card>
            <div className="border-b border-slate-200">
              <div className="flex">
                <button
                  className={`flex-1 px-6 py-4 transition-colors ${
                    activeTab === 'cotizaciones'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => setActiveTab('cotizaciones')}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Cotizaciones ({serviceQuotes.length})
                  </div>
                </button>
                <button
                  className={`flex-1 px-6 py-4 transition-colors ${
                    activeTab === 'insumos'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => setActiveTab('insumos')}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Package className="w-4 h-4" />
                    Ofertas de Insumos ({servicePacks.length})
                  </div>
                </button>
              </div>
            </div>

            <CardBody>
              {activeTab === 'cotizaciones' ? (
                serviceQuotes.length > 0 ? (
                  <div className="space-y-4">
                    {serviceQuotes.map(quote => (
                      <QuoteCard 
                        key={quote.id} 
                        quote={quote} 
                        isSelected={service.assignedQuoteId === quote.id}
                        canSelect={user?.id === service.solicitanteId && service.status === 'en_evaluacion'}
                        onSelect={handleSelectQuote}
                        canEdit={quote.providerId === user?.id && (service.status === 'publicado' || service.status === 'en_evaluacion')}
                        onEdit={(quoteId) => navigate(`/servicios/${id}/cotizar/${quoteId}`)}
                        canDelete={quote.providerId === user?.id && (service.status === 'publicado' || service.status === 'en_evaluacion')}
                        onDelete={handleDeleteQuote}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={FileText}
                    title="Sin cotizaciones aún"
                    description="Este servicio aún no ha recibido cotizaciones."
                  />
                )
              ) : (
                servicePacks.length > 0 ? (
                  <div className="space-y-4">
                    {servicePacks.map(pack => (
                      <Card key={pack.id}>
                        <CardBody>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-slate-900 mb-1">Pack de {pack.providerName}</h3>
                              <p className="text-sm text-slate-500">
                                {pack.items.length} {pack.items.length === 1 ? 'insumo' : 'insumos'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-slate-500 text-sm mb-1">Precio Total</p>
                              <p className="text-2xl text-slate-900">${pack.totalPrice.toLocaleString('es-CL')}</p>
                            </div>
                          </div>

                          {pack.notes && (
                            <div className="p-3 bg-slate-50 rounded-lg mb-4">
                              <p className="text-sm text-slate-600">{pack.notes}</p>
                            </div>
                          )}

                          <div className="space-y-2">
                            <h4 className="text-sm text-slate-600 mb-2">Insumos incluidos:</h4>
                            {pack.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-slate-700">{item.insumoName}</span>
                                <span className="text-slate-500">{item.quantity} {item.unit}</span>
                              </div>
                            ))}
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Package}
                    title="Sin packs de insumos"
                    description="Aún no hay ofertas de packs de insumos para este servicio."
                  />
                )
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <h3>Acciones</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {canQuote && (
                <Button
                  fullWidth
                  onClick={() => navigate(`/servicios/${id}/cotizar`)}
                >
                  Enviar Cotización
                </Button>
              )}

              {canCreatePack && (
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={() => navigate(`/servicios/${id}/pack`)}
                >
                  Crear Pack de Insumos
                </Button>
              )}

              {canProposeEquivalencias && (
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => navigate(`/servicios/${id}/equivalencias`)}
                >
                  Proponer Equivalencias
                </Button>
              )}

              {canEditQuote && userQuote && (
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => navigate(`/servicios/${id}/cotizar/${userQuote.id}`)}
                >
                  <Edit className="w-4 h-4" />
                  Editar mi Cotización
                </Button>
              )}

              {canCompleteService && (
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={handleCompleteService}
                >
                  <Star className="w-4 h-4" />
                  Completar y Calificar
                </Button>
              )}

              {canCancelService && (
                <Button
                  fullWidth
                  variant="danger"
                  onClick={handleCancelService}
                >
                  <XCircle className="w-4 h-4" />
                  Cancelar Servicio
                </Button>
              )}
            </CardBody>
          </Card>

          {/* Service Timeline */}
          <Card>
            <CardHeader>
              <h3>Estado del Servicio</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900">Publicado</p>
                    <p className="text-xs text-slate-500">
                      {new Date(service.createdAt).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                </div>

                {serviceQuotes.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      service.status === 'en_evaluacion' || service.status === 'asignado' || service.status === 'completado'
                        ? 'bg-emerald-100'
                        : 'bg-slate-100'
                    }`}>
                      <CheckCircle2 className={`w-4 h-4 ${
                        service.status === 'en_evaluacion' || service.status === 'asignado' || service.status === 'completado'
                          ? 'text-emerald-600'
                          : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900">Cotizaciones Recibidas</p>
                      <p className="text-xs text-slate-500">{serviceQuotes.length} cotizaciones</p>
                    </div>
                  </div>
                )}

                {service.status === 'asignado' && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900">Proveedor Asignado</p>
                      <p className="text-xs text-slate-500">En progreso</p>
                    </div>
                  </div>
                )}

                {service.status === 'completado' && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900">Completado</p>
                      <p className="text-xs text-slate-500">Servicio finalizado</p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleSubmitRating}
          providerName={serviceQuotes.find(q => q.id === service?.assignedQuoteId)?.providerName || ''}
        />
      )}
    </div>
  );
}