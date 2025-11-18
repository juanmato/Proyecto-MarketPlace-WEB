import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardBody, CardHeader } from '../components/design-system/Card';
import { Button } from '../components/design-system/Button';
import { Input } from '../components/design-system/Input';
import { Textarea } from '../components/design-system/Textarea';
import { Select } from '../components/design-system/Select';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface Insumo {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export function NuevoServicio() {
  const { user } = useAuth();
  const { addService } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'jardineria',
    address: '',
    city: 'Santiago',
    preferredDate: ''
  });
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [newInsumo, setNewInsumo] = useState({
    name: '',
    quantity: '',
    unit: 'unidades'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.address || !formData.city || !formData.preferredDate) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    const newService = {
      id: `service-${Date.now()}`,
      solicitanteId: user!.id,
      solicitanteName: user!.name,
      title: formData.title,
      description: formData.description,
      category: formData.category as 'jardineria' | 'piscinas' | 'limpieza' | 'otros',
      address: formData.address,
      city: formData.city,
      preferredDate: formData.preferredDate,
      insumos: insumos,
      status: 'publicado' as const,
      createdAt: new Date().toISOString()
    };

    addService(newService);
    toast.success('Servicio publicado exitosamente');
    navigate('/servicios');
  };

  const addInsumo = () => {
    if (!newInsumo.name || !newInsumo.quantity) {
      toast.error('Completa los datos del insumo');
      return;
    }

    const insumo: Insumo = {
      id: `temp-${Date.now()}`,
      name: newInsumo.name,
      quantity: Number(newInsumo.quantity),
      unit: newInsumo.unit
    };

    setInsumos([...insumos, insumo]);
    setNewInsumo({ name: '', quantity: '', unit: 'unidades' });
    toast.success('Insumo agregado');
  };

  const removeInsumo = (id: string) => {
    setInsumos(insumos.filter(i => i.id !== id));
  };

  if (user?.role !== 'solicitante') {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/servicios')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Button>

      <h1 className="mb-2">Publicar Nuevo Servicio</h1>
      <p className="text-slate-600 mb-8">
        Completa la información del servicio que necesitas
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <h2>Información Básica</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Título del servicio"
              required
              placeholder="Ej: Limpieza de jardín con poda de árboles"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <Textarea
              label="Descripción detallada"
              required
              placeholder="Describe en detalle el servicio que necesitas..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Categoría"
                required
                options={[
                  { value: 'jardineria', label: 'Jardinería' },
                  { value: 'piscinas', label: 'Piscinas' },
                  { value: 'limpieza', label: 'Limpieza' },
                  { value: 'otros', label: 'Otros' }
                ]}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />

              <Select
                label="Ciudad"
                required
                options={[
                  { value: 'Santiago', label: 'Santiago' },
                  { value: 'Valparaíso', label: 'Valparaíso' },
                  { value: 'Concepción', label: 'Concepción' },
                  { value: 'La Serena', label: 'La Serena' },
                  { value: 'Temuco', label: 'Temuco' }
                ]}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <Input
              label="Dirección"
              required
              placeholder="Ej: Av. Providencia 1234"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

            <Input
              type="date"
              label="Fecha preferida para el servicio"
              required
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </CardBody>
        </Card>

        {/* Insumos Requeridos */}
        <Card>
          <CardHeader>
            <h2>Insumos Requeridos (Opcional)</h2>
            <p className="text-sm text-slate-600 mt-1">
              Agrega los materiales o insumos que sabes que se necesitarán
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Add Insumo Form */}
            <div className="p-4 bg-slate-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Nombre del insumo"
                  value={newInsumo.name}
                  onChange={(e) => setNewInsumo({ ...newInsumo, name: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Cantidad"
                  value={newInsumo.quantity}
                  onChange={(e) => setNewInsumo({ ...newInsumo, quantity: e.target.value })}
                  min="0"
                  step="0.1"
                />
                <Select
                  options={[
                    { value: 'unidades', label: 'Unidades' },
                    { value: 'kg', label: 'Kilogramos' },
                    { value: 'litros', label: 'Litros' },
                    { value: 'metros', label: 'Metros' },
                    { value: 'bolsas', label: 'Bolsas' }
                  ]}
                  value={newInsumo.unit}
                  onChange={(e) => setNewInsumo({ ...newInsumo, unit: e.target.value })}
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addInsumo}>
                <Plus className="w-4 h-4" />
                Agregar Insumo
              </Button>
            </div>

            {/* Insumos List */}
            {insumos.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm text-slate-600">Insumos agregados:</h4>
                {insumos.map((insumo) => (
                  <div
                    key={insumo.id}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
                  >
                    <div>
                      <p className="text-slate-900">{insumo.name}</p>
                      <p className="text-sm text-slate-500">
                        {insumo.quantity} {insumo.unit}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInsumo(insumo.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/servicios')}
          >
            Cancelar
          </Button>
          <Button type="submit">
            Publicar Servicio
          </Button>
        </div>
      </form>
    </div>
  );
}