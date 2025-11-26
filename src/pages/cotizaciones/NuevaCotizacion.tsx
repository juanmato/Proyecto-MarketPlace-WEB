import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardBody, CardHeader } from '../../components/design-system/Card';
import { Button } from '../../components/design-system/Button';
import { Input } from '../../components/design-system/Input';
import { Textarea } from '../../components/design-system/Textarea';
import { Badge } from '../../components/design-system/Badge';
import { ArrowLeft, MapPin, Calendar, Tag } from 'lucide-react';
import { toast } from 'sonner';
import type { QuoteFormData } from '../../types';

// Utilidades importadas
import { STATUS_LABELS, CATEGORY_LABELS } from '../../constants/labels';
import { formatDateLong, formatCurrency } from '../../utils/formatting';
import { validateRequiredFields } from '../../utils/validation';
import { hasRole } from '../../utils/permissions';
import { EmptyStateWrapper } from '../../components/common/EmptyStateWrapper';
import { FormActions } from '../../components/common/FormActions';
import { InsumosList } from '../../components/common/InsumosList';

export function NuevaCotizacion() {
  const { id } = useParams();
  const { user } = useAuth();
  const { services, addQuote } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<QuoteFormData>({
    price: '',
    deadline: '',
    details: ''
  });

  const service = services.find(s => s.id === id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRequiredFields(formData, ['price', 'deadline', 'details'])) {
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
      createdAt: new Date().toISOString()
    };

    addQuote(newQuote);
    toast.success('Cotización enviada exitosamente');
    navigate(`/servicios/${id}`);
  };

  const handleSaveDraft = () => {
    toast.info('Borrador guardado');
  };

  // Verificación de permisos
  if (!hasRole(user, 'proveedor_servicio')) {
    navigate('/');
    return null;
  }

  return (
    <EmptyStateWrapper
      show={!service}
      title="Servicio no encontrado"
      description="El servicio que buscas no existe o fue eliminado."
      actionLabel="Volver a Servicios"
      onAction={() => navigate('/servicios')}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

              <FormActions
                onCancel={() => navigate(`/servicios/${id}`)}
                onSecondary={handleSaveDraft}
                submitLabel="Enviar Cotización"
                secondaryLabel="Guardar Borrador"
              />
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
                  <Badge variant={service!.status}>
                    {STATUS_LABELS[service!.status]}
                  </Badge>
                  <Badge variant="info">
                    {CATEGORY_LABELS[service!.category]}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-slate-900 mb-2">{service!.title}</h4>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {service!.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{service!.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateLong(service!.preferredDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Tag className="w-4 h-4" />
                    <span>Solicitado por {service!.solicitanteName}</span>
                  </div>
                </div>

                {service!.insumos.length > 0 && (
                  <div className="pt-4 border-t border-slate-200">
                    <InsumosList insumos={service!.insumos} compact />
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
    </EmptyStateWrapper>
  );
}
