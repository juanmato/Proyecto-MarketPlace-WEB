import { User, Service, Quote, Insumo, InsumoPack } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@solicitante.com',
    password: '123',
    role: 'solicitante',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
    phone: '+56 9 1234 5678'
  },
  {
    id: '2',
    name: 'María González',
    email: 'maria@proveedor.com',
    password: '123',
    role: 'proveedor_servicio',
    rating: 4.8,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    phone: '+56 9 8765 4321'
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    email: 'carlos@insumos.com',
    password: '123',
    role: 'proveedor_insumos',
    rating: 4.5,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    phone: '+56 9 5555 6666'
  },
  {
    id: '4',
    name: 'Ana Silva',
    email: 'ana@proveedor.com',
    password: '123',
    role: 'proveedor_servicio',
    rating: 4.9,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    phone: '+56 9 7777 8888'
  }
];

export const mockServices: Service[] = [
  {
    id: '1',
    title: 'Limpieza de jardín con poda de árboles',
    description: 'Necesito limpieza completa del jardín incluyendo poda de 3 árboles grandes, corte de césped y retiro de hojas secas.',
    category: 'jardineria',
    address: 'Av. Providencia 1234',
    city: 'Santiago',
    preferredDate: '2025-11-25',
    status: 'en_evaluacion',
    solicitanteId: '1',
    solicitanteName: 'Juan Pérez',
    createdAt: '2025-11-15T10:00:00Z',
    insumos: [
      { id: 'i1', name: 'Bolsas para residuos', quantity: 10, unit: 'unidades' },
      { id: 'i2', name: 'Fertilizante orgánico', quantity: 5, unit: 'kg' },
      { id: 'i3', name: 'Semillas de césped', quantity: 2, unit: 'kg' }
    ]
  },
  {
    id: '2',
    title: 'Mantenimiento de piscina mensual',
    description: 'Limpieza profunda de piscina 8x4m, ajuste de químicos y revisión de sistema de filtrado.',
    category: 'piscinas',
    address: 'Los Dominicos 5678',
    city: 'Santiago',
    preferredDate: '2025-11-20',
    status: 'publicado',
    solicitanteId: '1',
    solicitanteName: 'Juan Pérez',
    createdAt: '2025-11-14T14:30:00Z',
    insumos: [
      { id: 'i4', name: 'Cloro en pastillas', quantity: 3, unit: 'kg' },
      { id: 'i5', name: 'Regulador de pH', quantity: 2, unit: 'litros' },
      { id: 'i6', name: 'Alguicida', quantity: 1, unit: 'litro' }
    ]
  },
  {
    id: '3',
    title: 'Limpieza profunda de casa 3 pisos',
    description: 'Limpieza completa de casa de 3 pisos incluyendo ventanas, alfombras y baños.',
    category: 'limpieza',
    address: 'Las Condes 9012',
    city: 'Santiago',
    preferredDate: '2025-11-28',
    status: 'asignado',
    solicitanteId: '1',
    solicitanteName: 'Juan Pérez',
    createdAt: '2025-11-10T09:00:00Z',
    assignedQuoteId: 'q3',
    insumos: [
      { id: 'i7', name: 'Detergente multiuso', quantity: 5, unit: 'litros' },
      { id: 'i8', name: 'Desinfectante', quantity: 3, unit: 'litros' },
      { id: 'i9', name: 'Paños de microfibra', quantity: 20, unit: 'unidades' }
    ]
  },
  {
    id: '4',
    title: 'Instalación de sistema de riego automático',
    description: 'Necesito instalar riego automático en jardín de 200m2 con timer programable.',
    category: 'jardineria',
    address: 'Vitacura 3456',
    city: 'Santiago',
    preferredDate: '2025-12-05',
    status: 'publicado',
    solicitanteId: '1',
    solicitanteName: 'Juan Pérez',
    createdAt: '2025-11-16T11:00:00Z',
    insumos: [
      { id: 'i10', name: 'Aspersores', quantity: 12, unit: 'unidades' },
      { id: 'i11', name: 'Tubería PVC 1/2"', quantity: 50, unit: 'metros' },
      { id: 'i12', name: 'Timer digital', quantity: 1, unit: 'unidad' }
    ]
  }
];

export const mockQuotes: Quote[] = [
  {
    id: 'q1',
    serviceId: '1',
    providerId: '2',
    providerName: 'María González',
    price: 85000,
    deadline: 2,
    details: 'Incluye todo el equipamiento necesario. Equipo de 3 personas. Garantía de trabajo por 30 días.',
    createdAt: '2025-11-15T12:00:00Z'
  },
  {
    id: 'q2',
    serviceId: '1',
    providerId: '4',
    providerName: 'Ana Silva',
    price: 95000,
    deadline: 1,
    details: 'Servicio express. Incluye todos los insumos. Equipo especializado en poda de árboles grandes.',
    createdAt: '2025-11-15T14:30:00Z'
  },
  {
    id: 'q3',
    serviceId: '3',
    providerId: '2',
    providerName: 'María González',
    price: 120000,
    deadline: 1,
    details: 'Limpieza profunda certificada. Productos eco-friendly. Garantía de satisfacción.',
    createdAt: '2025-11-11T10:00:00Z'
  },
  {
    id: 'q4',
    serviceId: '2',
    providerId: '4',
    providerName: 'Ana Silva',
    price: 65000,
    deadline: 3,
    details: 'Mantenimiento completo de piscina. Análisis químico incluido.',
    createdAt: '2025-11-14T16:00:00Z'
  }
];

export const mockInsumos: Insumo[] = [
  {
    id: 'ins1',
    name: 'Bolsas para residuos 100L',
    category: 'jardineria',
    unit: 'unidad',
    unitPrice: 500,
    stock: 200,
    providerId: '3'
  },
  {
    id: 'ins2',
    name: 'Fertilizante orgánico premium',
    category: 'jardineria',
    unit: 'kg',
    unitPrice: 3500,
    stock: 150,
    providerId: '3'
  },
  {
    id: 'ins3',
    name: 'Semillas de césped inglés',
    category: 'jardineria',
    unit: 'kg',
    unitPrice: 8000,
    stock: 80,
    providerId: '3'
  },
  {
    id: 'ins4',
    name: 'Cloro en pastillas 90%',
    category: 'piscinas',
    unit: 'kg',
    unitPrice: 12000,
    stock: 100,
    providerId: '3'
  },
  {
    id: 'ins5',
    name: 'Regulador de pH líquido',
    category: 'piscinas',
    unit: 'litro',
    unitPrice: 8500,
    stock: 60,
    providerId: '3'
  },
  {
    id: 'ins6',
    name: 'Detergente multiuso concentrado',
    category: 'limpieza',
    unit: 'litro',
    unitPrice: 4500,
    stock: 120,
    providerId: '3'
  },
  {
    id: 'ins7',
    name: 'Desinfectante industrial',
    category: 'limpieza',
    unit: 'litro',
    unitPrice: 6000,
    stock: 90,
    providerId: '3'
  },
  {
    id: 'ins8',
    name: 'Paños de microfibra profesional',
    category: 'limpieza',
    unit: 'unidad',
    unitPrice: 1200,
    stock: 300,
    providerId: '3'
  }
];

export const mockInsumoPacks: InsumoPack[] = [
  {
    id: 'pack1',
    name: 'Pack Limpieza de Jardín Completo',
    serviceId: '1',
    providerId: '3',
    providerName: 'Carlos Rodríguez',
    items: [
      { insumoId: 'ins1', insumoName: 'Bolsas para residuos 100L', quantity: 10, unitPrice: 500 },
      { insumoId: 'ins2', insumoName: 'Fertilizante orgánico premium', quantity: 5, unitPrice: 3500 },
      { insumoId: 'ins3', insumoName: 'Semillas de césped inglés', quantity: 2, unitPrice: 8000 }
    ],
    totalPrice: 38500,
    createdAt: '2025-11-15T15:00:00Z'
  },
  {
    id: 'pack2',
    name: 'Pack Mantenimiento Piscina',
    serviceId: '2',
    providerId: '3',
    providerName: 'Carlos Rodríguez',
    items: [
      { insumoId: 'ins4', insumoName: 'Cloro en pastillas 90%', quantity: 3, unitPrice: 12000 },
      { insumoId: 'ins5', insumoName: 'Regulador de pH líquido', quantity: 2, unitPrice: 8500 }
    ],
    totalPrice: 53000,
    createdAt: '2025-11-14T17:00:00Z'
  }
];