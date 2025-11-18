export type UserRole = 'solicitante' | 'proveedor_servicio' | 'proveedor_insumos';

export type ServiceStatus = 'publicado' | 'en_evaluacion' | 'asignado' | 'completado' | 'cancelado';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  rating?: number;
  phone?: string;
}

export interface Service {
  id: string;
  solicitanteId: string;
  solicitanteName: string;
  title: string;
  description: string;
  category: 'jardineria' | 'piscinas' | 'limpieza' | 'otros';
  address: string;
  city: string;
  preferredDate: string;
  insumos: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
  }[];
  status: 'publicado' | 'en_evaluacion' | 'asignado' | 'completado' | 'cancelado';
  assignedQuoteId?: string;
  rating?: number;
  ratingComment?: string;
  createdAt: string;
}

export interface ServiceInsumo {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Quote {
  id: string;
  serviceId: string;
  providerId: string;
  providerName: string;
  price: number;
  deadline: number; // días
  details: string;
  createdAt: string;
}

export interface Insumo {
  id: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  stock: number;
  providerId: string;
}

export interface InsumoPack {
  id: string;
  name: string;
  serviceId: string;
  providerId: string;
  providerName: string;
  items: {
    insumoId: string;
    insumoName: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalPrice: number;
  createdAt: string;
}