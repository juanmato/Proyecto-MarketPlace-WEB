import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody, CardHeader } from '../components/design-system/Card';
import { Button } from '../components/design-system/Button';
import { Input } from '../components/design-system/Input';
import { Select } from '../components/design-system/Select';
import { EmptyState } from '../components/design-system/EmptyState';
import { Badge } from '../components/design-system/Badge';
import { mockInsumos } from '../data/mockData';
import { Plus, Search, Package, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Insumo } from '../types';

export function Insumos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'jardineria',
    unit: 'unidades',
    unitPrice: '',
    stock: ''
  });

  if (user?.role !== 'proveedor_insumos') {
    navigate('/');
    return null;
  }

  const myInsumos = mockInsumos.filter(i => i.providerId === user.id);

  const filteredInsumos = myInsumos.filter(insumo => {
    const matchesSearch = insumo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || insumo.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.unitPrice || !formData.stock) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (editingId) {
      toast.success('Insumo actualizado correctamente');
    } else {
      toast.success('Insumo creado correctamente');
    }

    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'jardineria',
      unit: 'unidades',
      unitPrice: '',
      stock: ''
    });
  };

  const handleEdit = (insumo: Insumo) => {
    setFormData({
      name: insumo.name,
      category: insumo.category,
      unit: insumo.unit,
      unitPrice: insumo.unitPrice.toString(),
      stock: insumo.stock.toString()
    });
    setEditingId(insumo.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este insumo?')) {
      toast.success('Insumo eliminado correctamente');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'jardineria', label: 'Jardinería' },
    { value: 'piscinas', label: 'Piscinas' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'otros', label: 'Otros' }
  ];

  const units = [
    { value: 'unidades', label: 'Unidades' },
    { value: 'kg', label: 'Kilogramos' },
    { value: 'litros', label: 'Litros' },
    { value: 'metros', label: 'Metros' },
    { value: 'bolsas', label: 'Bolsas' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="mb-2">Catálogo de Insumos</h1>
          <p className="text-slate-600">
            Administra tu inventario de productos y materiales
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Agregar Insumo
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <h2>{editingId ? 'Editar Insumo' : 'Nuevo Insumo'}</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre del insumo"
                  required
                  placeholder="Ej: Fertilizante orgánico premium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <Select
                  label="Categoría"
                  required
                  options={categories.filter(c => c.value !== 'all')}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />

                <Select
                  label="Unidad de medida"
                  required
                  options={units}
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />

                <Input
                  type="number"
                  label="Precio unitario (CLP)"
                  required
                  placeholder="Ej: 3500"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  min="0"
                />

                <Input
                  type="number"
                  label="Stock disponible"
                  required
                  placeholder="Ej: 150"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  min="0"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingId ? 'Actualizar' : 'Crear'} Insumo
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar insumos..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:w-64">
            <Select
              options={categories}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Insumos Table */}
      {filteredInsumos.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-slate-600">Nombre</th>
                      <th className="px-6 py-4 text-left text-slate-600">Categoría</th>
                      <th className="px-6 py-4 text-left text-slate-600">Unidad</th>
                      <th className="px-6 py-4 text-left text-slate-600">Precio</th>
                      <th className="px-6 py-4 text-left text-slate-600">Stock</th>
                      <th className="px-6 py-4 text-left text-slate-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInsumos.map((insumo) => (
                      <tr key={insumo.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-900">{insumo.name}</td>
                        <td className="px-6 py-4">
                          <Badge variant="info">
                            {categories.find(c => c.value === insumo.category)?.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{insumo.unit}</td>
                        <td className="px-6 py-4 text-slate-900">
                          ${insumo.unitPrice.toLocaleString('es-CL')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900">{insumo.stock}</span>
                            {insumo.stock < 50 && (
                              <Badge variant="warning" size="sm">
                                <AlertTriangle className="w-3 h-3" />
                                Bajo
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(insumo)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(insumo.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredInsumos.map((insumo) => (
              <Card key={insumo.id}>
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-slate-900 mb-1">{insumo.name}</h4>
                      <Badge variant="info">
                        {categories.find(c => c.value === insumo.category)?.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Precio</p>
                      <p className="text-slate-900">
                        ${insumo.unitPrice.toLocaleString('es-CL')}/{insumo.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Stock</p>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-900">{insumo.stock}</p>
                        {insumo.stock < 50 && (
                          <Badge variant="warning" size="sm">Bajo</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      fullWidth
                      onClick={() => handleEdit(insumo)}
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      fullWidth
                      onClick={() => handleDelete(insumo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={Package}
          title="No se encontraron insumos"
          description={
            searchTerm || categoryFilter !== 'all'
              ? 'No hay insumos que coincidan con tus filtros.'
              : 'Aún no has agregado ningún insumo. ¡Comienza agregando tu primer producto!'
          }
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" />
              Agregar Primer Insumo
            </Button>
          }
        />
      )}

      {/* Summary Stats */}
      {filteredInsumos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardBody>
              <p className="text-sm text-slate-600 mb-1">Total Insumos</p>
              <p className="text-2xl text-slate-900">{filteredInsumos.length}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-slate-600 mb-1">Stock Total</p>
              <p className="text-2xl text-slate-900">
                {filteredInsumos.reduce((sum, i) => sum + i.stock, 0).toLocaleString('es-CL')}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-slate-600 mb-1">Stock Bajo</p>
              <p className="text-2xl text-orange-600">
                {filteredInsumos.filter(i => i.stock < 50).length}
              </p>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
