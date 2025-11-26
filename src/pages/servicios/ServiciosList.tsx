import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ServiceCard } from '../../components/ServiceCard';
import { Button } from '../../components/design-system/Button';
import { Input } from '../../components/design-system/Input';
import { Select } from '../../components/design-system/Select';
import { EmptyState } from '../../components/design-system/EmptyState';
import { Plus, Search, Filter, Briefcase } from 'lucide-react';
import { Service } from '../../types';
import { useServicesReducer } from '../../hooks/useServicesReducer';

export function ServiciosList() {
  const { user } = useAuth();
  const { services: allServices } = useData();
  const navigate = useNavigate();
  
  const {
    state,
    filteredServices,
    setServices,
    setFilter,
    resetFilters
  } = useServicesReducer();

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Initialize services based on user role - only once on mount
    let userServices: Service[] = [];
    
    if (user?.role === 'solicitante') {
      userServices = allServices.filter(s => s.solicitanteId === user.id);
    } else {
      userServices = allServices;
    }
    
    setServices(userServices);
  }, [user?.id, user?.role, allServices, setServices]); // Add allServices to dependencies

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'jardineria', label: 'Jardinería' },
    { value: 'piscinas', label: 'Piscinas' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'otros', label: 'Otros' }
  ];

  const cities = [
    { value: 'all', label: 'Todas las ciudades' },
    { value: 'Santiago', label: 'Santiago' },
    { value: 'Valparaíso', label: 'Valparaíso' },
    { value: 'Concepción', label: 'Concepción' }
  ];

  const statuses = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'publicado', label: 'Publicado' },
    { value: 'en_evaluacion', label: 'En Evaluación' },
    { value: 'asignado', label: 'Asignado' },
    { value: 'completado', label: 'Completado' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="mb-2">
            {user?.role === 'solicitante' ? 'Mis Servicios' : 'Servicios Disponibles'}
          </h1>
          <p className="text-slate-600">
            {user?.role === 'solicitante' 
              ? 'Administra y da seguimiento a tus servicios publicados'
              : 'Encuentra servicios para cotizar'
            }
          </p>
        </div>
        {user?.role === 'solicitante' && (
          <Button onClick={() => navigate('/servicios/nuevo')}>
            <Plus className="w-4 h-4" />
            Publicar Servicio
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={state.filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </div>

        {/* Filters */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
          <Select
            options={categories}
            value={state.filters.category}
            onChange={(e) => setFilter('category', e.target.value)}
          />
          <Select
            options={cities}
            value={state.filters.city}
            onChange={(e) => setFilter('city', e.target.value)}
          />
          <Select
            options={statuses}
            value={state.filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
          />
        </div>

        {/* Active Filters Count */}
        {(state.filters.search || state.filters.category !== 'all' || state.filters.city !== 'all' || state.filters.status !== 'all') && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {filteredServices.length} {filteredServices.length === 1 ? 'resultado' : 'resultados'} encontrado{filteredServices.length === 1 ? '' : 's'}
            </p>
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No se encontraron servicios"
          description={
            user?.role === 'solicitante'
              ? 'Aún no has publicado ningún servicio. ¡Comienza publicando tu primer servicio!'
              : 'No hay servicios disponibles que coincidan con tus filtros.'
          }
          action={
            user?.role === 'solicitante' ? (
              <Button onClick={() => navigate('/servicios/nuevo')}>
                <Plus className="w-4 h-4" />
                Publicar Primer Servicio
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}