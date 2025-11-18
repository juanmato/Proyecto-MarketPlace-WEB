import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardBody, CardHeader } from '../components/design-system/Card';
import { Button } from '../components/design-system/Button';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Plus,
  Package,
  FileText,
  DollarSign
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { services, quotes, insumos, insumoPacks } = useData();
  const navigate = useNavigate();

  // Metrics based on user role
  const getMetrics = () => {
    if (user?.role === 'solicitante') {
      const myServices = services.filter(s => s.solicitanteId === user.id);
      const activeServices = myServices.filter(s => s.status !== 'completado' && s.status !== 'cancelado');
      const completedServices = myServices.filter(s => s.status === 'completado');
      const quotesReceived = quotes.filter(q => 
        myServices.some(s => s.id === q.serviceId)
      );

      return [
        { label: 'Servicios Activos', value: activeServices.length, icon: Briefcase, color: 'text-blue-600' },
        { label: 'Cotizaciones Recibidas', value: quotesReceived.length, icon: FileText, color: 'text-emerald-600' },
        { label: 'Servicios Completados', value: completedServices.length, icon: CheckCircle, color: 'text-purple-600' },
        { label: 'Total Servicios', value: myServices.length, icon: TrendingUp, color: 'text-orange-600' }
      ];
    }

    if (user?.role === 'proveedor_servicio') {
      const myQuotes = quotes.filter(q => q.providerId === user.id);
      const servicesWithMyQuotes = services.filter(s => 
        myQuotes.some(q => q.serviceId === s.id)
      );
      const pendingQuotes = myQuotes.filter(q => {
        const service = services.find(s => s.id === q.serviceId);
        return service && (service.status === 'publicado' || service.status === 'en_evaluacion');
      });
      const acceptedQuotes = myQuotes.filter(q => {
        const service = services.find(s => s.id === q.serviceId);
        return service && service.assignedQuoteId === q.id;
      });
      const totalRevenue = acceptedQuotes.reduce((sum, q) => sum + q.price, 0);

      return [
        { label: 'Cotizaciones Enviadas', value: myQuotes.length, icon: FileText, color: 'text-blue-600' },
        { label: 'Pendientes', value: pendingQuotes.length, icon: Clock, color: 'text-yellow-600' },
        { label: 'Aceptadas', value: acceptedQuotes.length, icon: CheckCircle, color: 'text-emerald-600' },
        { label: 'Ingresos Totales', value: `$${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-purple-600' }
      ];
    }

    if (user?.role === 'proveedor_insumos') {
      const myInsumos = insumos.filter(i => i.providerId === user.id);
      const totalStock = myInsumos.reduce((sum, i) => sum + i.stock, 0);
      const lowStock = myInsumos.filter(i => i.stock < 50).length;
      const categories = new Set(myInsumos.map(i => i.category)).size;

      return [
        { label: 'Insumos Registrados', value: myInsumos.length, icon: Package, color: 'text-blue-600' },
        { label: 'Stock Total', value: totalStock, icon: TrendingUp, color: 'text-emerald-600' },
        { label: 'Stock Bajo', value: lowStock, icon: Clock, color: 'text-orange-600' },
        { label: 'Categorías', value: categories, icon: Briefcase, color: 'text-purple-600' }
      ];
    }

    return [];
  };

  const metrics = getMetrics();

  const getQuickActions = () => {
    if (user?.role === 'solicitante') {
      return [
        { label: 'Publicar Servicio', icon: Plus, action: () => navigate('/servicios/nuevo'), variant: 'primary' as const },
        { label: 'Ver Mis Servicios', icon: Briefcase, action: () => navigate('/servicios'), variant: 'outline' as const }
      ];
    }

    if (user?.role === 'proveedor_servicio') {
      return [
        { label: 'Ver Servicios Disponibles', icon: Briefcase, action: () => navigate('/servicios'), variant: 'primary' as const },
        { label: 'Mis Cotizaciones', icon: FileText, action: () => navigate('/servicios'), variant: 'outline' as const }
      ];
    }

    if (user?.role === 'proveedor_insumos') {
      return [
        { label: 'Agregar Insumo', icon: Plus, action: () => navigate('/insumos'), variant: 'primary' as const },
        { label: 'Ver Catálogo', icon: Package, action: () => navigate('/insumos'), variant: 'outline' as const }
      ];
    }

    return [];
  };

  const quickActions = getQuickActions();

  const getRoleTitle = () => {
    if (user?.role === 'solicitante') return 'Panel del Solicitante';
    if (user?.role === 'proveedor_servicio') return 'Panel del Proveedor';
    if (user?.role === 'proveedor_insumos') return 'Panel de Insumos';
    return 'Dashboard';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">{getRoleTitle()}</h1>
        <p className="text-slate-600">
          Bienvenido de vuelta, {user?.name}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{metric.label}</p>
                  <p className="text-2xl text-slate-900">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-slate-50 ${metric.color}`}>
                  <metric.icon className="w-6 h-6" />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <h2>Acciones Rápidas</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.action}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h2>Actividad Reciente</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {user?.role === 'solicitante' && services
              .filter(s => s.solicitanteId === user.id)
              .slice(0, 3)
              .map(service => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-slate-900">{service.title}</p>
                    <p className="text-sm text-slate-500">{service.city} • {new Date(service.createdAt).toLocaleDateString('es-CL')}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/servicios/${service.id}`)}>
                    Ver Detalle
                  </Button>
                </div>
              ))
            }

            {user?.role === 'proveedor_servicio' && quotes
              .filter(q => q.providerId === user.id)
              .slice(0, 3)
              .map(quote => (
                <div key={quote.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-slate-900">Cotización ${quote.price.toLocaleString('es-CL')}</p>
                    <p className="text-sm text-slate-500">
                      {quote.status === 'pendiente' ? 'Pendiente' : quote.status === 'aceptada' ? 'Aceptada' : 'Rechazada'} • {new Date(quote.createdAt).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/servicios/${quote.serviceId}`)}>
                    Ver Servicio
                  </Button>
                </div>
              ))
            }

            {user?.role === 'proveedor_insumos' && insumos
              .filter(i => i.providerId === user.id)
              .slice(0, 3)
              .map(insumo => (
                <div key={insumo.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-slate-900">{insumo.name}</p>
                    <p className="text-sm text-slate-500">
                      Stock: {insumo.stock} {insumo.unit} • ${insumo.unitPrice.toLocaleString('es-CL')}/{insumo.unit}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate('/insumos')}>
                    Editar
                  </Button>
                </div>
              ))
            }
          </div>
        </CardBody>
      </Card>
    </div>
  );
}