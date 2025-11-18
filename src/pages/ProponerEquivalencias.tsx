import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardBody, CardHeader } from '../components/design-system/Card';
import { Button } from '../components/design-system/Button';
import { Input } from '../components/design-system/Input';
import { Select } from '../components/design-system/Select';
import { Textarea } from '../components/design-system/Textarea';
import { Badge } from '../components/design-system/Badge';
import { EmptyState } from '../components/design-system/EmptyState';
import { mockInsumos } from '../data/mockData';
import { ArrowLeft, Plus, X, Package, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Equivalencia {
  insumoOriginal: string;
  insumoEquivalente: string;
  razon: string;
}

export function ProponerEquivalencias() {
  const { id } = useParams();
  const { user } = useAuth();
  const { services } = useData();
  const navigate = useNavigate();
  
  const [equivalencias, setEquivalencias] = useState<Equivalencia[]>([]);
  const [notasGenerales, setNotasGenerales] = useState('');
  const [currentEquivalencia, setCurrentEquivalencia] = useState({
    insumoOriginalId: '',
    miInsumoId: '',
    razon: ''
  });

  const service = services.find(s => s.id === id);
  const myInsumos = mockInsumos.filter(i => i.providerId === user?.id);

  if (user?.role !== 'proveedor_insumos') {
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

  if (service.insumos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon={Package}
          title="Sin insumos requeridos"
          description="Este servicio no tiene insumos especificados para proponer equivalencias."
          action={
            <Button onClick={() => navigate(`/servicios/${id}`)}>
              Volver al Servicio
            </Button>
          }
        />
      </div>
    );
  }

  const agregarEquivalencia = () => {
    if (!currentEquivalencia.insumoOriginalId || !currentEquivalencia.miInsumoId || !currentEquivalencia.razon) {
      toast.error('Completa todos los campos de la equivalencia');
      return;
    }

    const insumoOriginal = service.insumos.find(i => i.id === currentEquivalencia.insumoOriginalId);
    const miInsumo = myInsumos.find(i => i.id === currentEquivalencia.miInsumoId);

    if (!insumoOriginal || !miInsumo) return;

    const nuevaEquivalencia: Equivalencia = {
      insumoOriginal: insumoOriginal.name,
      insumoEquivalente: miInsumo.name,
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

    // In real app, this would send to backend
    toast.success('Propuesta de equivalencias enviada exitosamente');
    navigate(`/servicios/${id}`);
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

      <h1 className="mb-2">Proponer Equivalencias de Insumos</h1>
      <p className="text-slate-600 mb-8">
        Ofrece alternativas de tus productos que cumplan la misma función
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Card */}
            <Card>
              <CardBody>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-blue-900 mb-2">💡 ¿Qué son las equivalencias?</h4>
                  <p className="text-sm text-blue-800">
                    Si tienes productos similares o alternativos que pueden reemplazar los insumos 
                    solicitados, proponlos aquí explicando por qué son una buena opción.
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Add Equivalencia */}
            <Card>
              <CardHeader>
                <h2>Agregar Equivalencia</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Insumo solicitado"
                    options={[
                      { value: '', label: 'Selecciona...' },
                      ...service.insumos.map(insumo => ({
                        value: insumo.id,
                        label: `${insumo.name} (${insumo.quantity} ${insumo.unit})`
                      }))
                    ]}
                    value={currentEquivalencia.insumoOriginalId}
                    onChange={(e) => setCurrentEquivalencia({ 
                      ...currentEquivalencia, 
                      insumoOriginalId: e.target.value 
                    })}
                  />

                  <div className="flex items-center justify-center text-slate-400">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>

                <Select
                  label="Tu producto equivalente"
                  options={[
                    { value: '', label: 'Selecciona de tu catálogo...' },
                    ...myInsumos.map(insumo => ({
                      value: insumo.id,
                      label: `${insumo.name} - $${insumo.unitPrice.toLocaleString('es-CL')}/${insumo.unit} (Stock: ${insumo.stock})`
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
                  placeholder="Ej: Mismo rendimiento con mejor relación precio-calidad..."
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
                  disabled={!currentEquivalencia.insumoOriginalId || !currentEquivalencia.miInsumoId || !currentEquivalencia.razon}
                >
                  <Plus className="w-4 h-4" />
                  Agregar Equivalencia
                </Button>
              </CardBody>
            </Card>

            {/* Equivalencias List */}
            {equivalencias.length > 0 && (
              <Card>
                <CardHeader>
                  <h2>Equivalencias Propuestas ({equivalencias.length})</h2>
                </CardHeader>
                <CardBody className="space-y-3">
                  {equivalencias.map((eq, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="info" size="sm">Original</Badge>
                            <span className="text-slate-700">{eq.insumoOriginal}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="success" size="sm">Equivalente</Badge>
                            <span className="text-slate-900">{eq.insumoEquivalente}</span>
                          </div>
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
                      <p className="text-sm text-slate-600 pl-4 border-l-2 border-blue-300">
                        {eq.razon}
                      </p>
                    </div>
                  ))}

                  <Textarea
                    label="Notas generales (opcional)"
                    placeholder="Información adicional sobre tus propuestas..."
                    value={notasGenerales}
                    onChange={(e) => setNotasGenerales(e.target.value)}
                    rows={3}
                  />
                </CardBody>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/servicios/${id}`)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={equivalencias.length === 0}
              >
                Enviar Propuesta
              </Button>
            </div>
          </form>
        </div>

        {/* Service Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3>Insumos Solicitados</h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {service.insumos.map(insumo => (
                  <li key={insumo.id} className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-slate-900 mb-1">{insumo.name}</p>
                    <p className="text-sm text-slate-500">
                      {insumo.quantity} {insumo.unit}
                    </p>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h4 className="text-slate-900 mb-3">💡 Consejos</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Ofrece productos de calidad similar o superior</li>
                <li>• Explica claramente las ventajas</li>
                <li>• Considera el precio competitivo</li>
                <li>• Asegura stock suficiente</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}