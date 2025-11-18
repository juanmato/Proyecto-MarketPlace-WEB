import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../components/design-system/Card';
import { Badge } from '../components/design-system/Badge';
import { Button } from '../components/design-system/Button';
import { EmptyState } from '../components/design-system/EmptyState';
import { TrendingUp, Package, ShoppingCart } from 'lucide-react';

interface InsumoDemand {
  name: string;
  totalQuantity: number;
  unit: string;
  servicesCount: number;
}

export function DemandaInsumos() {
  const { user } = useAuth();
  const { services } = useData();
  const navigate = useNavigate();

  if (user?.role !== 'proveedor_insumos') {
    return null;
  }

  // Get all active services
  const activeServices = services.filter(
    s => s.status === 'publicado' || s.status === 'en_evaluacion'
  );

  // Calculate demand
  const demandMap = new Map<string, InsumoDemand>();

  activeServices.forEach(service => {
    service.insumos.forEach(insumo => {
      const key = `${insumo.name}-${insumo.unit}`;
      if (demandMap.has(key)) {
        const existing = demandMap.get(key)!;
        existing.totalQuantity += insumo.quantity;
        existing.servicesCount += 1;
      } else {
        demandMap.set(key, {
          name: insumo.name,
          totalQuantity: insumo.quantity,
          unit: insumo.unit,
          servicesCount: 1
        });
      }
    });
  });

  const demands = Array.from(demandMap.values()).sort(
    (a, b) => b.totalQuantity - a.totalQuantity
  );

  const totalServicesWithInsumos = activeServices.filter(s => s.insumos.length > 0).length;
  const totalInsumosTypes = demands.length;
  const mostDemanded = demands[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Demanda de Insumos</h1>
        <p className="text-slate-600">
          Analiza qué insumos están siendo más solicitados en los servicios activos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Servicios Activos</p>
                <p className="text-2xl text-slate-900">{totalServicesWithInsumos}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Tipos de Insumos</p>
                <p className="text-2xl text-slate-900">{totalInsumosTypes}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Más Demandado</p>
                {mostDemanded ? (
                  <p className="text-lg text-slate-900 line-clamp-1">
                    {mostDemanded.name}
                  </p>
                ) : (
                  <p className="text-slate-500">-</p>
                )}
              </div>
              <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Demand Table */}
      {demands.length > 0 ? (
        <>
          {/* Desktop Table */}
          <Card className="hidden md:block">
            <CardHeader>
              <h2>Insumos Más Demandados</h2>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-600">Posición</th>
                    <th className="px-6 py-4 text-left text-slate-600">Insumo</th>
                    <th className="px-6 py-4 text-left text-slate-600">Demanda Total</th>
                    <th className="px-6 py-4 text-left text-slate-600">Servicios</th>
                    <th className="px-6 py-4 text-left text-slate-600">Promedio por Servicio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {demands.map((demand, index) => (
                    <tr key={`${demand.name}-${demand.unit}`} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900">#{index + 1}</span>
                          {index === 0 && <Badge variant="warning" size="sm">Top</Badge>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-900">{demand.name}</td>
                      <td className="px-6 py-4">
                        <span className="text-slate-900">
                          {demand.totalQuantity.toLocaleString('es-CL')} {demand.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{demand.servicesCount}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {(demand.totalQuantity / demand.servicesCount).toFixed(1)} {demand.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {demands.map((demand, index) => (
              <Card key={`${demand.name}-${demand.unit}`}>
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-slate-900">#{index + 1}</span>
                      {index === 0 && <Badge variant="warning" size="sm">Top</Badge>}
                    </div>
                  </div>

                  <h4 className="text-slate-900 mb-3">{demand.name}</h4>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Demanda Total</p>
                      <p className="text-slate-900">
                        {demand.totalQuantity.toLocaleString('es-CL')} {demand.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Servicios</p>
                      <p className="text-slate-900">{demand.servicesCount}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-500">Promedio por Servicio</p>
                      <p className="text-slate-900">
                        {(demand.totalQuantity / demand.servicesCount).toFixed(1)} {demand.unit}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={Package}
          title="Sin datos de demanda"
          description="No hay servicios activos que requieran insumos en este momento."
          action={
            <Button onClick={() => navigate('/servicios')}>
              Ver Servicios
            </Button>
          }
        />
      )}

      {/* Recommendations */}
      {demands.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <h2>Recomendaciones</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-blue-900 mb-2">📊 Oportunidad de Negocio</h4>
                <p className="text-sm text-blue-800">
                  Los insumos más demandados representan una gran oportunidad. Asegúrate de tener 
                  stock suficiente de <span className="font-semibold">{mostDemanded?.name}</span> para 
                  capturar más ventas.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h4 className="text-emerald-900 mb-2">💡 Crea Packs Personalizados</h4>
                <p className="text-sm text-emerald-800">
                  Usa esta información para crear packs de insumos que se ajusten a las necesidades 
                  reales de los servicios y aumenta tus ventas.
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <Button onClick={() => navigate('/insumos')}>
                  Ir a Mi Catálogo
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}