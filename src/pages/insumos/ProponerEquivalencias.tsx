import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardBody, CardHeader } from '../../components/design-system/Card';
import { Button } from '../../components/design-system/Button';
import { Select } from '../../components/design-system/Select';
import { Textarea } from '../../components/design-system/Textarea';
import { Badge } from '../../components/design-system/Badge';
import { ArrowLeft, Plus, X, Package, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Utilidades reutilizables
import { STATUS_LABELS, CATEGORY_LABELS } from '../../constants';
import { validateRequiredFields } from '../../utils';
import { hasRole } from '../../utils';
import { EmptyStateWrapper } from '../../components/common';
import { FormActions } from '../../components/common';

interface EquivalenciaTemp {
  insumoOriginal: string;
  insumoEquivalente: string;
  originalId: string;
  equivalenteId: string;
  razon: string;
}

export function ProponerEquivalencias() {
  const { id } = useParams();
  const { user } = useAuth();
  const { services, insumos, addEquivalencia } = useData();
  const navigate = useNavigate();

  const [equivalencias, setEquivalencias] = useState<EquivalenciaTemp[]>([]);
  const [notasGenerales, setNotasGenerales] = useState('');
  const [currentEquivalencia, setCurrentEquivalencia] = useState({
    insumoOriginalId: '',
    miInsumoId: '',
    razon: ''
  });

  const service = services.find(s => s.id === id);
  const myInsumos = insumos.filter(i => i.providerId === user?.id);

  // Verificación de permisos con utilidad reutilizable
  if (!hasRole(user, 'proveedor_insumos')) {
    navigate('/');
    return null;
  }

  const agregarEquivalencia = () => {
    // Usar utilidad de validación reutilizable
    if (!validateRequiredFields(currentEquivalencia, ['insumoOriginalId', 'miInsumoId', 'razon'])) {
      toast.error('Completa todos los campos de la equivalencia');
      return;
    }

    const insumoOriginal = service!.insumos.find(i => i.id === currentEquivalencia.insumoOriginalId);
    const miInsumo = myInsumos.find(i => i.id === currentEquivalencia.miInsumoId);

    if (!insumoOriginal || !miInsumo) return;

    const nuevaEquivalencia: EquivalenciaTemp = {
      insumoOriginal: insumoOriginal.name,
      insumoEquivalente: miInsumo.name,
      originalId: insumoOriginal.id,
      equivalenteId: miInsumo.id,
      razon: currentEquivalencia.razon
    };

    setEquivalencias([...equivalencias, nuevaEquivalencia]);
    setCurrentEquivalencia({ insumoOriginalId: '', miInsumoId: '', razon: '' });
    toast.success('Equivalencia agregada');
  };

  const eliminarEquivalencia = (index: number) => {
    setEquivalencias(equivalencias.filter((_, i) => i !== index));
    toast.info('Equivalencia eliminada');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (equivalencias.length === 0) {
      toast.error('Agrega al menos una equivalencia');
      return;
    }

    // ✅ AHORA SÍ GUARDAMOS LAS EQUIVALENCIAS
    equivalencias.forEach(equiv => {
      const equivalencia = {
        id: `equiv-${Date.now()}-${Math.random()}`,
        serviceId: id!,
        providerId: user!.id,
        providerName: user!.name,
        originalInsumoId: equiv.originalId,
        originalInsumoName: equiv.insumoOriginal,
        proposedInsumoId: equiv.equivalenteId,
        proposedInsumoName: equiv.insumoEquivalente,
        reason: equiv.razon,
        notes: notasGenerales,
        createdAt: new Date().toISOString()
      };

      addEquivalencia(equivalencia);
    });

    toast.success('Propuesta de equivalencias enviada exitosamente');
    navigate(`/servicios/${id}`);
  };

  return (
    <EmptyStateWrapper
      show={!service}
      title="Servicio no encontrado"
      description="El servicio que buscas no existe o fue eliminado."
      actionLabel="Volver a Servicios"
      onAction={() => navigate('/servicios')}
    >
      <EmptyStateWrapper
        show={service?.insumos.length === 0}
        icon={Package}
        title="Sin insumos requeridos"
        description="Este servicio no tiene insumos especificados para proponer equivalencias."
        actionLabel="Volver al Servicio"
        onAction={() => navigate(`/servicios/${id}`)}
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

          <h1 className="mb-2">Proponer Equivalencias de Insumos</h1>
          <p className="text-slate-600 mb-8">
            Propón insumos alternativos de tu catálogo que puedan reemplazar los solicitados
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Agregar Equivalencia */}
                <Card>
                  <CardHeader>
                    <h2>Agregar Equivalencia</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <Select
                      label="Insumo solicitado"
                      options={[
                        { value: '', label: 'Selecciona...' },
                        ...service!.insumos.map(i => ({
                          value: i.id,
                          label: `${i.name} (${i.quantity} ${i.unit})`
                        }))
                      ]}
                      value={currentEquivalencia.insumoOriginalId}
                      onChange={(e) => setCurrentEquivalencia({
                        ...currentEquivalencia,
                        insumoOriginalId: e.target.value
                      })}
                    />

                    <Select
                      label="Tu insumo equivalente"
                      options={[
                        { value: '', label: 'Selecciona...' },
                        ...myInsumos.map(i => ({
                          value: i.id,
                          label: `${i.name} - $${i.unitPrice.toLocaleString('es-CL')}/${i.unit}`
                        }))
                      ]}
                      value={currentEquivalencia.miInsumoId}
                      onChange={(e) => setCurrentEquivalencia({
                        ...currentEquivalencia,
                        miInsumoId: e.target.value
                      })}
                    />

                    <Textarea
                      label="Razón de la equivalencia"
                      placeholder="Explica por qué este insumo es equivalente..."
                      value={currentEquivalencia.razon}
                      onChange={(e) => setCurrentEquivalencia({
                        ...currentEquivalencia,
                        razon: e.target.value
                      })}
                      rows={3}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={agregarEquivalencia}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Equivalencia
                    </Button>
                  </CardBody>
                </Card>

                {/* Lista de Equivalencias */}
                {equivalencias.length > 0 && (
                  <Card>
                    <CardHeader>
                      <h2>Equivalencias Propuestas ({equivalencias.length})</h2>
                    </CardHeader>
                    <CardBody className="space-y-3">
                      {equivalencias.map((equiv, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-slate-600">{equiv.insumoOriginal}</span>
                              <ArrowRight className="w-4 h-4 text-slate-400" />
                              <span className="text-blue-600 font-medium">{equiv.insumoEquivalente}</span>
                            </div>
                            <p className="text-sm text-slate-500">{equiv.razon}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarEquivalencia(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                )}

                {/* Notas Generales */}
                <Card>
                  <CardHeader>
                    <h2>Notas Generales (Opcional)</h2>
                  </CardHeader>
                  <CardBody>
                    <Textarea
                      placeholder="Agrega notas adicionales sobre tu propuesta..."
                      value={notasGenerales}
                      onChange={(e) => setNotasGenerales(e.target.value)}
                      rows={4}
                    />
                  </CardBody>
                </Card>

                <FormActions
                  onCancel={() => navigate(`/servicios/${id}`)}
                  submitLabel="Enviar Propuesta"
                />
              </form>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3>Información del Servicio</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <Badge variant={service!.status}>
                      {STATUS_LABELS[service!.status]}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-slate-900 mb-1">{service!.title}</h4>
                    <p className="text-sm text-slate-600">
                      {CATEGORY_LABELS[service!.category]}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">
                      Insumos solicitados: {service!.insumos.length}
                    </p>
                    <p className="text-sm text-slate-500">
                      Mis insumos disponibles: {myInsumos.length}
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h4 className="text-slate-900 mb-3">💡 Consejos</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Propón insumos de calidad similar o superior</li>
                    <li>• Explica claramente las ventajas de tu alternativa</li>
                    <li>• Considera el precio y disponibilidad</li>
                    <li>• Sé honesto sobre las diferencias</li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </EmptyStateWrapper>
    </EmptyStateWrapper>
  );
}
