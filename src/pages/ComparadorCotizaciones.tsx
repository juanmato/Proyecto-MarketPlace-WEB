import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardBody, CardHeader } from '../components/design-system/Card';
import { Button } from '../components/design-system/Button';
import { Badge } from '../components/design-system/Badge';
import { EmptyState } from '../components/design-system/EmptyState';
import { ArrowLeft, Star, DollarSign, Clock, CheckCircle2, AlertCircle, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

type SortBy = 'price' | 'deadline' | 'rating';

export function ComparadorCotizaciones() {
  const { id } = useParams();
  const { user } = useAuth();
  const { services, quotes, selectQuote: selectQuoteAction } = useData();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortBy>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const service = services.find(s => s.id === id);
  const serviceQuotes = quotes.filter(q => q.serviceId === id);

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedQuotes = [...serviceQuotes].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'deadline':
        comparison = a.deadline - b.deadline;
        break;
      case 'rating':
        comparison = a.providerRating - b.providerRating;
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSelectQuote = (quoteId: string) => {
    if (confirm('¿Estás seguro de seleccionar esta cotización? El servicio pasará a estado "Asignado".')) {
      selectQuoteAction(id!, quoteId);
      toast.success('Cotización seleccionada exitosamente');
      navigate(`/servicios/${id}`);
    }
  };

  if (user?.role !== 'solicitante' || service?.solicitanteId !== user.id) {
    navigate('/');
    return null;
  }

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

  if (serviceQuotes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon={AlertCircle}
          title="Sin cotizaciones"
          description="Aún no hay cotizaciones para comparar en este servicio."
          action={
            <Button onClick={() => navigate(`/servicios/${id}`)}>
              Volver al Servicio
            </Button>
          }
        />
      </div>
    );
  }

  const bestPrice = Math.min(...serviceQuotes.map(q => q.price));
  const bestDeadline = Math.min(...serviceQuotes.map(q => q.deadline));
  const bestRating = Math.max(...serviceQuotes.map(q => q.providerRating));

  const SortButton = ({ field, label }: { field: SortBy; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
        sortBy === field
          ? 'bg-blue-100 text-blue-700'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(`/servicios/${id}`)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Button>

      <div className="mb-8">
        <h1 className="mb-2">Comparador de Cotizaciones</h1>
        <p className="text-slate-600">
          Compara las propuestas recibidas para: <span className="text-slate-900">{service.title}</span>
        </p>
      </div>

      {/* Sorting Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-sm text-slate-600">Ordenar por:</span>
        <SortButton field="price" label="Precio" />
        <SortButton field="deadline" label="Plazo" />
        <SortButton field="rating" label="Rating" />
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-slate-600">Proveedor</th>
                  <th className="px-6 py-4 text-left text-slate-600">Precio</th>
                  <th className="px-6 py-4 text-left text-slate-600">Plazo</th>
                  <th className="px-6 py-4 text-left text-slate-600">Rating</th>
                  <th className="px-6 py-4 text-left text-slate-600">Detalle</th>
                  <th className="px-6 py-4 text-left text-slate-600">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-slate-900">{quote.providerName}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(quote.createdAt).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="text-slate-900">
                          ${quote.price.toLocaleString('es-CL')}
                        </p>
                        {quote.price === bestPrice && (
                          <Badge variant="success" size="sm">Mejor</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="text-slate-900">
                          {quote.deadline} {quote.deadline === 1 ? 'día' : 'días'}
                        </p>
                        {quote.deadline === bestDeadline && (
                          <Badge variant="success" size="sm">Más rápido</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-amber-600">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-slate-900">{quote.providerRating}</span>
                        </div>
                        {quote.providerRating === bestRating && (
                          <Badge variant="success" size="sm">Top</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">
                        {quote.details}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        onClick={() => handleSelectQuote(quote.id)}
                        disabled={quote.status === 'aceptada'}
                      >
                        {quote.status === 'aceptada' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Seleccionada
                          </>
                        ) : (
                          'Seleccionar'
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {sortedQuotes.map((quote) => (
          <Card key={quote.id}>
            <CardBody className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-slate-900 mb-1">{quote.providerName}</h4>
                  <div className="flex items-center gap-1 text-sm text-amber-600">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{quote.providerRating}</span>
                    {quote.providerRating === bestRating && (
                      <Badge variant="success" size="sm" className="ml-2">Top</Badge>
                    )}
                  </div>
                </div>
                {quote.status === 'aceptada' && (
                  <Badge variant="success">Seleccionada</Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-slate-500">Precio</p>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-900">
                        ${quote.price.toLocaleString('es-CL')}
                      </p>
                      {quote.price === bestPrice && (
                        <Badge variant="success" size="sm">Mejor</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-500">Plazo</p>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-900">
                        {quote.deadline} {quote.deadline === 1 ? 'día' : 'días'}
                      </p>
                      {quote.deadline === bestDeadline && (
                        <Badge variant="success" size="sm">Más rápido</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">{quote.details}</p>
              </div>

              <Button
                fullWidth
                onClick={() => handleSelectQuote(quote.id)}
                disabled={quote.status === 'aceptada'}
              >
                {quote.status === 'aceptada' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Seleccionada
                  </>
                ) : (
                  'Seleccionar'
                )}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="mt-8">
        <CardBody>
          <h3 className="mb-4">Resumen de Comparación</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-700 mb-1">Mejor Precio</p>
              <p className="text-2xl text-emerald-900">${bestPrice.toLocaleString('es-CL')}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-1">Plazo Más Corto</p>
              <p className="text-2xl text-blue-900">{bestDeadline} {bestDeadline === 1 ? 'día' : 'días'}</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-700 mb-1">Mejor Rating</p>
              <p className="text-2xl text-amber-900 flex items-center gap-1">
                <Star className="w-6 h-6 fill-current" />
                {bestRating}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}