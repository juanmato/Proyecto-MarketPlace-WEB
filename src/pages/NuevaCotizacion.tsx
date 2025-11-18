import { useState } from 'react';
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

export function NuevaCotizacion() {
  const { id } = useParams();
  const { user } = useAuth();
  const { services, quotes, addQuote } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    price: '',
    deadline: '',
    details: ''
  });

  const service = services.find(s => s.id === id);
  const existingQuote = quotes.find(q => q.serviceId === id && q.providerId === user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.price || !formData.deadline || !formData.details) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const newQuote = {
      id: `quote-${Date.now()}`,
      serviceId: id!,
      providerId: user!.id,
      providerName: user!.name,
      price: parseFloat(formData.price),
      deadline: parseInt(formData.deadline),
      details: formData.details,
      rating: 4.5, // Mock rating
      createdAt: new Date().toISOString()
    };

    addQuote(newQuote);
    toast.success('Cotización enviada exitosamente');
    navigate(`/servicios/${id}`);
  };

  const handleSaveDraft = () => {
    toast.info('Borrador guardado');
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

      <h1 className="mb-2">Enviar Cotización</h1>
      <p className="text-slate-600 mb-8">
        Completa los detalles de tu propuesta para este servicio
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
                  helperText="Explica claramente qué incluye tu cotización para que el cliente pueda tomar una decisión informada"
                />
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
              <Button
                type="button"
                variant="ghost"
                onClick={handleSaveDraft}
              >
                Guardar Borrador
              </Button>
              <Button type="submit">
                Enviar Cotización
              </Button>
            </div>
          </form>
        </div>

        {/* Service Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3>Servicio a Cotizar</h3>
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

          {/* Tips Card */}
          <Card>
            <CardBody>
              <h4 className="text-slate-900 mb-3">💡 Consejos</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Sé claro y específico en tu propuesta</li>
                <li>• Incluye todos los costos en el precio</li>
                <li>• Menciona garantías si las ofreces</li>
                <li>• Destaca tu experiencia en servicios similares</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}