import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardBody, CardHeader } from '../../components/design-system/Card';
import { Button } from '../../components/design-system/Button';
import { Select } from '../../components/design-system/Select';
import { Input } from '../../components/design-system/Input';
import { Textarea } from '../../components/design-system/Textarea';
import { Badge } from '../../components/design-system/Badge';
import { EmptyState } from '../../components/design-system/EmptyState';
import { mockInsumos } from '../../data/mockData';
import { ArrowLeft, Plus, X, Package, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PackItem {
  insumoId: string;
  insumoName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export function NuevoPackInsumos() {
  const { id } = useParams();
  const { user } = useAuth();
  const { services, addInsumoPack } = useData();
  const navigate = useNavigate();
  
  const [packName, setPackName] = useState('');
  const [notas, setNotas] = useState('');
  const [items, setItems] = useState<PackItem[]>([]);
  const [selectedInsumoId, setSelectedInsumoId] = useState('');
  const [quantity, setQuantity] = useState('');

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

  const availableInsumos = myInsumos.filter(
    insumo => !items.some(item => item.insumoId === insumo.id)
  );

  const addItem = () => {
    if (!selectedInsumoId || !quantity) {
      toast.error('Selecciona un insumo y cantidad');
      return;
    }

    const insumo = myInsumos.find(i => i.id === selectedInsumoId);
    if (!insumo) return;

    const qty = Number(quantity);
    
    // Validar stock suficiente
    if (qty > insumo.stock) {
      toast.error(`Stock insuficiente. Disponible: ${insumo.stock} ${insumo.unit}`);
      return;
    }

    if (qty <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }

    const newItem: PackItem = {
      insumoId: insumo.id,
      insumoName: insumo.name,
      quantity: qty,
      unitPrice: insumo.unitPrice,
      unit: insumo.unit
    };

    setItems([...items, newItem]);
    setSelectedInsumoId('');
    setQuantity('');
    toast.success('Insumo agregado al pack');
  };

  const removeItem = (insumoId: string) => {
    setItems(items.filter(item => item.insumoId !== insumoId));
    toast.info('Insumo removido del pack');
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Agrega al menos un insumo al pack');
      return;
    }

    const newPack = {
      id: `pack-${Date.now()}`,
      serviceId: id!,
      providerId: user!.id,
      providerName: user!.name,
      items: items.map(item => ({
        insumoId: item.insumoId,
        insumoName: item.insumoName,
        quantity: item.quantity,
        unit: item.unit
      })),
      totalPrice: totalPrice,
      notes: notas,
      createdAt: new Date().toISOString()
    };

    addInsumoPack(newPack);
    toast.success('Pack de insumos creado exitosamente');
    navigate(`/servicios/${id}`);
  };

  const totalPrice = calculateTotal();

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

      <h1 className="mb-2">Crear Pack de Insumos</h1>
      <p className="text-slate-600 mb-8">
        Arma un pack con tus productos para el servicio
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pack Info */}
            <Card>
              <CardHeader>
                <h2>Información del Pack</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Nombre del pack"
                  required
                  placeholder="Ej: Pack Completo Limpieza de Jardín"
                  value={packName}
                  onChange={(e) => setPackName(e.target.value)}
                />

                <Textarea
                  label="Notas adicionales (opcional)"
                  placeholder="Información adicional sobre el pack, garantías, etc."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={3}
                />
              </CardBody>
            </Card>

            {/* Add Insumos */}
            <Card>
              <CardHeader>
                <h2>Agregar Insumos</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Select
                        label="Selecciona un insumo"
                        options={[
                          { value: '', label: 'Selecciona...' },
                          ...availableInsumos.map(insumo => ({
                            value: insumo.id,
                            label: `${insumo.name} (Stock: ${insumo.stock} ${insumo.unit} - $${insumo.unitPrice.toLocaleString('es-CL')})`
                          }))
                        ]}
                        value={selectedInsumoId}
                        onChange={(e) => setSelectedInsumoId(e.target.value)}
                      />
                    </div>
                    <Input
                      type="number"
                      label="Cantidad"
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="0.1"
                      step="0.1"
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addItem}
                    disabled={!selectedInsumoId || !quantity}
                  >
                    <Plus className="w-4 h-4" />
                    Agregar al Pack
                  </Button>
                </div>

                {/* Items List */}
                {items.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm text-slate-600">Insumos en el pack:</h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.insumoId}
                          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-slate-900">{item.insumoName}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                              <span>{item.quantity} {item.unit}</span>
                              <span>×</span>
                              <span>${item.unitPrice.toLocaleString('es-CL')}</span>
                              <span>=</span>
                              <span className="text-emerald-600">
                                ${(item.quantity * item.unitPrice).toLocaleString('es-CL')}
                              </span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.insumoId)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-900">Precio Total del Pack:</span>
                        <span className="text-2xl text-emerald-900">
                          ${totalPrice.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>Aún no has agregado insumos al pack</p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/servicios/${id}`)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={items.length === 0}>
                Crear Pack de Insumos
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
              <div>
                <h4 className="text-slate-900 mb-2">{service.title}</h4>
                <p className="text-sm text-slate-600 line-clamp-3">
                  {service.description}
                </p>
              </div>

              <div className="text-sm">
                <p className="text-slate-500">Ciudad</p>
                <p className="text-slate-900">{service.city}</p>
              </div>

              {service.insumos.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">Insumos solicitados:</p>
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

          {/* Tips */}
          <Card>
            <CardBody>
              <h4 className="text-slate-900 mb-3">💡 Consejos</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Verifica que tengas stock suficiente</li>
                <li>• Ofrece precios competitivos</li>
                <li>• Incluye todos los insumos necesarios</li>
                <li>• Agrega notas sobre calidad o garantías</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}