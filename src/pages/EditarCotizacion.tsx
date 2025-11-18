import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardBody, CardHeader } from '../components/design-system/Card';
import { Button } from '../components/design-system/Button';
import { Input } from '../components/design-system/Input';
import { Textarea } from '../components/design-system/Textarea';
import { Badge } from '../components/design-system/Badge';
import { ArrowLeft, MapPin, Calendar, Tag, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '../components/design-system/EmptyState';

export function EditarCotizacion() {
  const { id, quoteId } = useParams();
  const { user } = useAuth();
  const { services, quotes, updateQuote } = useData();
  const navigate = useNavigate();

  const service = services.find(s => s.id === id);
  const quote = quotes.find(q => q.id === quoteId);

  const [formData, setFormData] = useState({
    price: quote?.price.toString() || '',
    deadline: quote?.deadline.toString() || '',
    details: quote?.details || ''
  });

  useEffect(() => {
    if (quote) {
      setFormData({
        price: quote.price.toString(),
        deadline: quote.deadline.toString(),
        details: quote.details || ''
      });
    }
  }, [quote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.price || !formData.deadline || !formData.details) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const updatedQuote = {
      ...quote!,
      price: parseFloat(formData.price),
      deadline: parseInt(formData.deadline),
      details: formData.details
    };

    updateQuote(updatedQuote);
    toast.success('Cotización actualizada exitosamente');
    navigate(`/servicios/${id}`);
  };

  if (user?.role !== 'proveedor_servicio') {
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

  if (!quote) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon={AlertCircle}
          title="Cotización no encontrada"
          description="La cotización que intentas editar no existe."
          action={
            <Button onClick={() => navigate(`/servicios/${id}`)}>
              Volver al Servicio
            </Button>
          }
        />
      </div>
    );
  }

  if (quote.providerId !== user.id) {
    toast.error('No puedes editar esta cotización');
    navigate(`/servicios/${id}`);
    return null;
  }

  // Solo se puede editar si el servicio está en Publicado o En Evaluación
  if (service.status !== 'publicado' && service.status !== 'en_evaluacion') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon={AlertCircle}
          title="No se puede editar"
          description="Esta cotización no se puede editar porque el servicio ya fue asignado o completado."
          action={
            <Button onClick={() => navigate(`/servicios/${id}`)}>
              Volver al Servicio
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(`/servicios/${id}`)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Button>

      <h1 className="mb-2">Editar Cotización</h1>
      <p className="text-slate-600 mb-8">
        Actualiza los detalles de tu propuesta
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <h2>Detalles de la Cotización</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                  <p className="text-sm text-blue-800">
                    💡 Puedes editar tu cotización mientras el servicio esté en estado Publicado o En Evaluación
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Precio (CLP)"
                    required
                    placeholder="Ej: 85000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    min="0"
                  />

                  <Input
                    type="number"
                    label="Plazo (días)"
                    required
                    placeholder="Ej: 2"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    min="1"
                  />
                </div>

                <Textarea
                  label="Detalle de la propuesta"
                  required
                  placeholder="Describe qué incluye tu servicio, garantías, equipo, etc..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={6}
                  helperText="Explica claramente qué incluye tu cotización"
                />

                {/* Muestra valores originales */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-sm text-slate-600 mb-2">Valores originales:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500">Precio:</span>
                      <span className="ml-2 text-slate-900">${quote.price.toLocaleString('es-CL')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Plazo:</span>
                      <span className="ml-2 text-slate-900">{quote.deadline} días</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/servicios/${id}`)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Actualizar Cotización
              </Button>
            </div>
          </form>
        </div>

        {/* Service Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3>Servicio</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-start gap-2">
                <Badge variant={service.status}>
                  {statusLabels[service.status]}
                </Badge>
                <Badge variant="info">
                  {categoryLabels[service.category]}
                </Badge>
              </div>

              <div>
                <h4 className="text-slate-900 mb-2">{service.title}</h4>
                <p className="text-sm text-slate-600 line-clamp-3">
                  {service.description}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{service.city}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(service.preferredDate).toLocaleDateString('es-CL')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Tag className="w-4 h-4" />
                  <span>Solicitado por {service.solicitanteName}</span>
                </div>
              </div>

              {service.insumos.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">Insumos requeridos:</p>
                  <ul className="space-y-1 text-sm text-slate-500">
                    {service.insumos.map(insumo => (
                      <li key={insumo.id}>
                        • {insumo.name} ({insumo.quantity} {insumo.unit})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}