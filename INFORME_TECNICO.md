# INFORME TÉCNICO
## Proyecto Demo: Plataforma Marketplace de Servicios

**Tipo de Proyecto:** Demostración Funcional Frontend-Only
**Tecnología Principal:** React 18.3.1 + Vite 6.4.1
**Fecha:** Noviembre 2025
**Versión:** 0.1.0

---

## ÍNDICE

1. [Arquitectura General del Proyecto](#1-arquitectura-general-del-proyecto)
2. [Tecnologías y Herramientas](#2-tecnologías-y-herramientas)
3. [Organización del Código](#3-organización-del-código)
4. [Simulación de Lógica de Marketplace](#4-simulación-de-lógica-de-marketplace)
5. [Flujos Técnicos Implementados](#5-flujos-técnicos-implementados)
6. [Limitaciones Técnicas de la Demo](#6-limitaciones-técnicas-de-la-demo)
7. [Qué se Necesitaría para Convertirla en un Sistema Real](#7-qué-se-necesitaría-para-convertirla-en-un-sistema-real)
8. [Conclusión Técnica](#8-conclusión-técnica)

---

## 1. ARQUITECTURA GENERAL DEL PROYECTO

### 1.1 Naturaleza del Proyecto

Este proyecto es una **aplicación web frontend-only** desarrollada como demostración funcional (proof of concept) de una plataforma marketplace de servicios. Técnicamente, opera bajo las siguientes premisas arquitecturales:

- **Aplicación SPA (Single Page Application)** construida con React 18.3.1
- **Sin backend real**: No existe servidor de aplicaciones, API REST ni endpoints
- **Sin base de datos**: No hay persistencia en servidor ni DBMS
- **Persistencia simulada**: Utiliza `localStorage` del navegador como mecanismo de persistencia temporal
- **Autenticación simulada**: Sistema de login hardcodeado sin tokens reales ni sesiones de servidor

### 1.2 Arquitectura Frontend

```
┌─────────────────────────────────────────┐
│         Navegador (Cliente)             │
├─────────────────────────────────────────┤
│  React 18 + React Router + Vite        │
│  ┌───────────────────────────────────┐  │
│  │   Context API (Estado Global)     │  │
│  │   - AuthContext (Usuario)         │  │
│  │   - DataContext (Datos Mock)      │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   localStorage (Persistencia)     │  │
│  │   - servicombo_services           │  │
│  │   - servicombo_quotes             │  │
│  │   - servicombo_insumos            │  │
│  │   - servicombo_packs              │  │
│  │   - servicombo_equivalencias      │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 1.3 Estructura Modular del Proyecto

El proyecto sigue una arquitectura modular basada en features (funcionalidades):

```
src/
├── pages/                    # Páginas organizadas por features
│   ├── public/              # Páginas públicas (sin autenticación)
│   │   ├── Landing.tsx      # Homepage del sitio
│   │   └── Login.tsx        # Autenticación simulada
│   ├── shared/              # Páginas compartidas entre roles
│   │   ├── Dashboard.tsx    # Dashboard role-aware
│   │   └── ServicioDetail.tsx
│   ├── servicios/           # Gestión de servicios
│   │   ├── ServiciosList.tsx
│   │   ├── NuevoServicio.tsx
│   │   └── ComparadorCotizaciones.tsx
│   ├── cotizaciones/        # Gestión de cotizaciones
│   │   ├── NuevaCotizacion.tsx
│   │   ├── EditarCotizacion.tsx
│   │   └── MisCotizaciones.tsx
│   └── insumos/            # Gestión de insumos
│       ├── InsumosList.tsx
│       ├── NuevoPackInsumos.tsx
│       ├── ProponerEquivalencias.tsx
│       └── DemandaInsumos.tsx
│
├── components/              # Componentes reutilizables
│   ├── common/             # Componentes de negocio comunes
│   │   ├── StatCard.tsx
│   │   ├── EmptyStateWrapper.tsx
│   │   ├── FormActions.tsx
│   │   ├── InsumosList.tsx
│   │   └── ConfirmDialog.tsx
│   ├── design-system/      # Design System propio
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── ...
│   ├── layout/             # Componentes de layout
│   │   └── Navbar.tsx
│   └── ui/                 # Componentes UI de Radix
│       └── ...
│
├── context/                # Estado global (Context API)
│   ├── AuthContext.tsx    # Autenticación y usuario actual
│   └── DataContext.tsx    # Datos de la aplicación
│
├── hooks/                  # Custom Hooks
│   └── useLocalStorage.ts # Sincronización con localStorage
│
├── utils/                  # Utilidades reutilizables
│   ├── formatting.ts      # Formateo de datos
│   ├── validation.ts      # Validaciones de formularios
│   └── permissions.ts     # Lógica de permisos
│
├── constants/              # Constantes de la aplicación
│   ├── labels.ts          # Etiquetas centralizadas
│   └── options.ts         # Opciones de formularios
│
├── types/                  # Definiciones TypeScript
│   └── index.ts           # Interfaces y tipos
│
├── data/                   # Datos mock
│   └── mockData.ts        # Arrays de datos iniciales
│
├── App.tsx                # Componente raíz + Router
├── main.tsx               # Punto de entrada
└── index.css              # Estilos globales (Tailwind)
```

### 1.4 Patrón de Estado Global

El proyecto implementa un **patrón híbrido de gestión de estado**:

1. **Context API** para compartir estado entre componentes
2. **Custom Hook `useLocalStorage`** para sincronizar automáticamente con `localStorage`
3. **Estado local** con `useState` para UI específica de cada componente

```typescript
// Patrón de sincronización automática
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
}
```

---

## 2. TECNOLOGÍAS Y HERRAMIENTAS

### 2.1 Stack Tecnológico Principal

#### **Framework y Build Tool**
- **React 18.3.1**: Librería de UI con soporte para Concurrent Features
- **Vite 6.4.1**: Build tool de próxima generación con HMR ultra-rápido
- **TypeScript**: Tipado estático (configuración en `tsconfig.json`)

#### **Enrutamiento**
- **React Router DOM**: Sistema de navegación cliente (v6+)
  - Implementa rutas protegidas
  - Navegación programática
  - Parámetros de ruta dinámicos

#### **Gestión de Estado**
- **React Context API**: Estado global (AuthContext, DataContext)
- **Custom Hooks**: `useLocalStorage` para persistencia
- **useState/useReducer**: Estado local por componente

#### **Persistencia Simulada**
- **localStorage Web API**: Almacenamiento key-value en el navegador
  - Límite: ~5-10MB según navegador
  - Persistencia por origen (domain + protocol + port)
  - Datos serializados como JSON

### 2.2 Librerías UI y Design System

#### **Sistema de Componentes Base**
- **Radix UI**: Librería headless de componentes accesibles (30+ componentes)
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-select`
  - `@radix-ui/react-tooltip`
  - Entre otros

#### **Estilos**
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority (CVA)**: Gestión de variantes de componentes
- **clsx**: Composición condicional de clases CSS
- **tailwind-merge**: Merge inteligente de clases Tailwind

#### **Iconografía**
- **Lucide React**: Librería de iconos SVG optimizados (487 iconos)

#### **Notificaciones**
- **Sonner**: Sistema de toast notifications elegante

### 2.3 Librerías Especializadas

#### **Formularios**
- **React Hook Form**: Gestión de formularios performante
- Validaciones en cliente con JavaScript nativo

#### **Visualización de Datos**
- **Recharts**: Librería de charts basada en D3
- Utilizada en página de Demanda de Insumos

#### **Carousels y Componentes Complejos**
- **Embla Carousel React**: Carrusel de bajo nivel
- **Vaul**: Drawer component

#### **Temas**
- **next-themes**: Gestión de temas (light/dark mode)

### 2.4 Herramientas de Desarrollo

- **@vitejs/plugin-react-swc**: Compilador ultra-rápido de React con SWC
- **@types/***: Definiciones de tipos TypeScript
- **ESLint** (implícito en setup)
- **Git**: Control de versiones

---

## 3. ORGANIZACIÓN DEL CÓDIGO

### 3.1 Arquitectura por Capas

El proyecto implementa una separación clara de responsabilidades:

```
┌─────────────────────────────────────┐
│  CAPA DE PRESENTACIÓN (Pages)       │ ← Páginas específicas por rol/feature
├─────────────────────────────────────┤
│  CAPA DE COMPONENTES (Components)   │ ← Componentes reutilizables
├─────────────────────────────────────┤
│  CAPA DE LÓGICA (Hooks + Utils)     │ ← Lógica de negocio reutilizable
├─────────────────────────────────────┤
│  CAPA DE ESTADO (Context)           │ ← Estado global y gestión de datos
├─────────────────────────────────────┤
│  CAPA DE DATOS (localStorage)       │ ← Persistencia simulada
└─────────────────────────────────────┘
```

### 3.2 Organización de Páginas (14 páginas totales)

#### **Páginas Públicas (2)**
Sin autenticación requerida:
- `Landing.tsx`: Homepage con información del marketplace
- `Login.tsx`: Formulario de autenticación simulada

#### **Páginas Compartidas (2)**
Accesibles por múltiples roles:
- `Dashboard.tsx`: Dashboard dinámico según rol del usuario
- `ServicioDetail.tsx`: Página hub central de cada servicio

#### **Páginas de Servicios (3)**
Feature: Gestión de servicios publicados:
- `ServiciosList.tsx`: Búsqueda y listado de servicios
- `NuevoServicio.tsx`: Formulario de creación de servicio
- `ComparadorCotizaciones.tsx`: Comparación de cotizaciones recibidas

#### **Páginas de Cotizaciones (3)**
Feature: Gestión de cotizaciones:
- `NuevaCotizacion.tsx`: Crear cotización para un servicio
- `EditarCotizacion.tsx`: Editar cotización existente
- `MisCotizaciones.tsx`: Vista de todas mis cotizaciones

#### **Páginas de Insumos (4)**
Feature: Gestión de insumos y catálogo:
- `InsumosList.tsx`: CRUD completo de insumos
- `NuevoPackInsumos.tsx`: Armar pack de insumos para servicio
- `ProponerEquivalencias.tsx`: Proponer insumos alternativos
- `DemandaInsumos.tsx`: Analytics de demanda de insumos

### 3.3 Componentes Reutilizables

#### **Design System Propio** (`components/design-system/`)
Componentes base con estilos consistentes:
```typescript
// Ejemplo: Button con variantes
<Button variant="primary" size="md" fullWidth>
  Enviar
</Button>

// Variantes: primary | secondary | outline | ghost | danger
// Tamaños: sm | md | lg
```

Componentes incluidos:
- `Button`, `Input`, `Textarea`, `Select`
- `Card`, `CardHeader`, `CardBody`
- `Badge`, `EmptyState`, `Spinner`

#### **Componentes Comunes** (`components/common/`)
Componentes de lógica de negocio reutilizables:

**StatCard**: Tarjeta de estadística
```typescript
<StatCard
  title="Total Servicios"
  value={services.length}
  icon={Package}
  trend={{ value: 12, isPositive: true }}
/>
```

**EmptyStateWrapper**: Manejo de estados vacíos
```typescript
<EmptyStateWrapper
  show={items.length === 0}
  title="No hay elementos"
  description="Agrega tu primer elemento"
  actionLabel="Agregar"
  onAction={() => setShowForm(true)}
>
  {children}
</EmptyStateWrapper>
```

**FormActions**: Botones estándar de formularios
```typescript
<FormActions
  onCancel={() => navigate(-1)}
  submitLabel="Guardar"
  cancelLabel="Cancelar"
/>
```

### 3.4 Gestión de Estado

#### **AuthContext** (src/context/AuthContext.tsx)
Maneja autenticación y usuario actual:

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Usuarios hardcodeados
const MOCK_USERS = [
  { id: '1', email: 'cliente@test.com', role: 'solicitante', ... },
  { id: '2', email: 'proveedor@test.com', role: 'proveedor_servicio', ... },
  { id: '3', email: 'insumos@test.com', role: 'proveedor_insumos', ... }
];
```

#### **DataContext** (src/context/DataContext.tsx)
Gestiona todos los datos de la aplicación:

```typescript
interface DataContextType {
  // Estado
  services: Service[];
  quotes: Quote[];
  insumos: Insumo[];
  insumoPacks: InsumoPack[];
  equivalencias: InsumoEquivalencia[];

  // Operaciones CRUD
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  // ... (similar para quotes, insumos, packs, equivalencias)

  // Operaciones de negocio
  selectQuote: (serviceId: string, quoteId: string) => void;
  completeService: (serviceId: string, rating: number, comment: string) => void;
  cancelService: (serviceId: string) => void;
}
```

**Sincronización automática con localStorage:**
```typescript
const [services, setServices] = useLocalStorage<Service[]>(
  'servicombo_services',
  mockServices
);
```

### 3.5 Custom Hooks

#### **useLocalStorage** (src/hooks/useLocalStorage.ts)
Hook personalizado que sincroniza estado con `localStorage`:

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. Lee de localStorage al inicializar
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  // 2. Escribe en localStorage en cada cambio
  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function
      ? value(storedValue)
      : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
}
```

**Ventajas:**
- Elimina código duplicado de sincronización
- API idéntica a `useState`
- Type-safe con generics TypeScript

### 3.6 Utilidades Reutilizables

#### **Formateo** (src/utils/formatting.ts)
```typescript
formatDate(date: string, includeTime?: boolean): string
formatCurrency(amount: number): string // → "$3.500"
formatDeadline(days: number): string   // → "3 días"
```

#### **Validaciones** (src/utils/validation.ts)
```typescript
validateRequiredFields(
  data: Record<string, any>,
  fields: string[]
): boolean

validateForm(
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): string | null
```

#### **Permisos** (src/utils/permissions.ts)
```typescript
hasRole(user: User | null, role: UserRole): boolean
canQuoteService(user, serviceStatus, existingQuotes): boolean
canEditQuote(user, quote, serviceStatus): boolean
```

### 3.7 Sistema de Tipos TypeScript

**Tipos principales** (src/types/index.ts):

```typescript
// Roles del sistema
type UserRole = 'solicitante' | 'proveedor_servicio' | 'proveedor_insumos';

// Estados de servicio
type ServiceStatus = 'publicado' | 'en_evaluacion' | 'asignado' | 'completado' | 'cancelado';

// Entidades principales
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  rating?: number;
  phone?: string;
}

interface Service {
  id: string;
  solicitanteId: string;
  title: string;
  description: string;
  category: 'jardineria' | 'piscinas' | 'limpieza' | 'otros';
  address: string;
  city: string;
  preferredDate: string;
  insumos: ServiceInsumo[];
  status: ServiceStatus;
  assignedQuoteId?: string;
  rating?: number;
  ratingComment?: string;
  createdAt: string;
}

interface Quote {
  id: string;
  serviceId: string;
  providerId: string;
  providerName: string;
  price: number;
  deadline: number;
  details: string;
  createdAt: string;
}

interface Insumo {
  id: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  stock: number;
  providerId: string;
}

interface InsumoPack {
  id: string;
  name: string;
  serviceId: string;
  providerId: string;
  items: InsumoPackItem[];
  totalPrice: number;
  notes?: string;
  createdAt: string;
}

interface InsumoEquivalencia {
  id: string;
  serviceId: string;
  providerId: string;
  originalInsumoId: string;
  proposedInsumoId: string;
  reason: string;
  notes?: string;
  createdAt: string;
}
```

---

## 4. SIMULACIÓN DE LÓGICA DE MARKETPLACE

### 4.1 Datos Mock Iniciales

**Ubicación:** `src/data/mockData.ts`

El sistema se inicializa con datos pre-cargados:

```typescript
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'cliente@test.com',
    password: '123456',
    name: 'Carlos Martínez',
    role: 'solicitante',
    rating: 4.8
  },
  {
    id: '2',
    email: 'proveedor@test.com',
    password: '123456',
    name: 'Servicios Premium Ltda.',
    role: 'proveedor_servicio',
    rating: 4.9
  },
  {
    id: '3',
    email: 'insumos@test.com',
    password: '123456',
    name: 'Distribuidora Central',
    role: 'proveedor_insumos',
    rating: 4.7
  }
];

export const mockServices: Service[] = [
  {
    id: 'srv-1',
    solicitanteId: '1',
    title: 'Mantenimiento Integral de Piscina',
    category: 'piscinas',
    status: 'publicado',
    insumos: [
      { id: 'ins-1', name: 'Cloro granulado', quantity: 5, unit: 'kg' },
      { id: 'ins-2', name: 'Limpiafondos automático', quantity: 1, unit: 'unidades' }
    ],
    createdAt: '2024-11-20T10:00:00Z',
    // ...
  }
];

export const mockInsumos: Insumo[] = [ /* ... */ ];
export const mockQuotes: Quote[] = [ /* ... */ ];
```

**Primera carga:**
```
Usuario abre app → DataContext lee localStorage
                   ↓
          ¿Existe 'servicombo_services'?
                   ↓
          NO → Inicializa con mockServices
          SÍ → Carga datos guardados
```

### 4.2 Operaciones CRUD Simuladas

Todas las operaciones siguen el patrón:

```typescript
// CREATE
const addService = (service: Service) => {
  setServices(prev => [service, ...prev]);
  // ↑ Automáticamente sincroniza con localStorage
};

// READ
const service = services.find(s => s.id === id);

// UPDATE
const updateService = (service: Service) => {
  setServices(prev => prev.map(s =>
    s.id === service.id ? service : s
  ));
};

// DELETE
const deleteService = (id: string) => {
  setServices(prev => prev.filter(s => s.id !== id));
};
```

### 4.3 Filtrado y Búsqueda en Memoria

**Ejemplo en ServiciosList.tsx:**

```typescript
const filteredServices = services.filter(service => {
  // Filtro por texto
  const matchesSearch =
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase());

  // Filtro por categoría
  const matchesCategory =
    categoryFilter === 'all' ||
    service.category === categoryFilter;

  // Filtro por estado
  const matchesStatus =
    statusFilter === 'all' ||
    service.status === statusFilter;

  // Filtro por ciudad
  const matchesCity =
    cityFilter === 'all' ||
    service.city === cityFilter;

  return matchesSearch && matchesCategory && matchesStatus && matchesCity;
});
```

**Rendimiento:**
- Operación O(n) en cada render
- Funciona bien hasta ~1000 elementos
- No es escalable para producción

### 4.4 Navegación y Enrutamiento

**Definición de rutas** (src/App.tsx):

```typescript
<Routes>
  {/* Públicas */}
  <Route path="/landing" element={<Landing />} />
  <Route path="/login" element={<Login />} />

  {/* Protegidas */}
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />

  <Route path="/servicios/:id" element={
    <ProtectedRoute>
      <ServicioDetail />
    </ProtectedRoute>
  } />

  {/* ... más rutas */}
</Routes>
```

**Protección de rutas:**
```typescript
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
```

**Navegación programática:**
```typescript
const navigate = useNavigate();

// Navegación simple
navigate('/servicios');

// Con parámetros
navigate(`/servicios/${serviceId}`);

// Con estado
navigate('/dashboard', { state: { message: 'Servicio creado' } });

// Atrás
navigate(-1);
```

### 4.5 Simulación de Transacciones

#### **Flujo: Seleccionar Cotización**

```typescript
const selectQuote = (serviceId: string, quoteId: string) => {
  // 1. Cambiar estado del servicio
  setServices(prev => prev.map(s =>
    s.id === serviceId
      ? {
          ...s,
          status: 'asignado',
          assignedQuoteId: quoteId
        }
      : s
  ));

  // 2. Notificar al usuario
  toast.success('Cotización seleccionada');

  // 3. Navegar
  navigate('/dashboard');
};
```

**Limitación:** No hay transacciones atómicas. Si el navegador crashea entre pasos, puede quedar inconsistente.

#### **Flujo: Completar Servicio**

```typescript
const completeService = (serviceId: string, rating: number, comment: string) => {
  setServices(prev => prev.map(s =>
    s.id === serviceId
      ? {
          ...s,
          status: 'completado',
          rating,
          ratingComment: comment
        }
      : s
  ));
};
```

### 4.6 Validaciones Frontend

**Nivel 1: HTML5 Native**
```tsx
<input
  type="email"
  required
  minLength={3}
  maxLength={50}
/>
```

**Nivel 2: Validación en Submit**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateRequiredFields(formData, ['title', 'description', 'city'])) {
    toast.error('Completa todos los campos obligatorios');
    return;
  }

  if (formData.price < 0) {
    toast.error('El precio debe ser positivo');
    return;
  }

  // Proceder...
};
```

**Limitaciones:**
- Validaciones bypasseables (DevTools, curl)
- No hay validación de lógica de negocio en servidor
- No hay validación de unicidad real (IDs)

---

## 5. FLUJOS TÉCNICOS IMPLEMENTADOS

### 5.1 Flujo: Registro/Login Simulado

**Archivo:** `src/pages/public/Login.tsx`
**Contexto:** `src/context/AuthContext.tsx`

```
┌──────────┐
│ Usuario  │
│ ingresa  │
│ credenci │
│ ales     │
└────┬─────┘
     │
     ↓
┌─────────────────────────────────────┐
│ handleLogin(email, password)        │
│                                     │
│ 1. Busca en array MOCK_USERS:      │
│    const user = MOCK_USERS.find(   │
│      u => u.email === email &&     │
│           u.password === password  │
│    )                               │
│                                     │
│ 2. ¿Encontrado?                     │
│    NO  → return false, toast.error │
│    SÍ  → setUser(user)             │
│          ↓                          │
│          Guarda en localStorage:   │
│          'servicombo_user'         │
│          ↓                          │
│          navigate('/dashboard')    │
└─────────────────────────────────────┘
```

**Código técnico:**

```typescript
// AuthContext.tsx
const login = (email: string, password: string): boolean => {
  const user = MOCK_USERS.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return false;
  }

  setUser(user);
  localStorage.setItem('servicombo_user', JSON.stringify(user));
  return true;
};

// Login.tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const success = login(formData.email, formData.password);

  if (success) {
    toast.success('¡Bienvenido!');
    navigate('/dashboard');
  } else {
    toast.error('Credenciales incorrectas');
  }
};
```

**Limitaciones:**
- Passwords en texto plano
- Sin hashing (bcrypt, argon2)
- Sin tokens (JWT, OAuth)
- Sin sesión en servidor
- Sin rate limiting
- Sin CAPTCHA

### 5.2 Flujo: Crear Servicio

**Archivo:** `src/pages/servicios/NuevoServicio.tsx`

```
PASO 1: Usuario completa formulario
┌─────────────────────────────────┐
│ - Título                        │
│ - Descripción                   │
│ - Categoría (select)            │
│ - Dirección                     │
│ - Ciudad                        │
│ - Fecha preferida               │
│ - Insumos (array dinámico)      │
└────────────┬────────────────────┘
             │
             ↓ onClick="handleSubmit"
PASO 2: Validación frontend
┌─────────────────────────────────┐
│ validateRequiredFields([        │
│   'title', 'description',       │
│   'category', 'address'         │
│ ])                              │
│                                 │
│ if (insumos.length === 0)       │
│   → error                       │
└────────────┬────────────────────┘
             │ ✓ válido
             ↓
PASO 3: Construir objeto Service
┌─────────────────────────────────┐
│ const newService: Service = {   │
│   id: `srv-${Date.now()}`,      │
│   solicitanteId: user.id,       │
│   solicitanteName: user.name,   │
│   title: formData.title,        │
│   status: 'publicado',          │
│   insumos: [...],               │
│   createdAt: new Date().toISO() │
│ }                               │
└────────────┬────────────────────┘
             │
             ↓
PASO 4: Persistir en Context
┌─────────────────────────────────┐
│ addService(newService)          │
│   ↓                             │
│ setServices([newService, ...])  │
│   ↓                             │
│ localStorage.setItem(           │
│   'servicombo_services', JSON   │
│ )                               │
└────────────┬────────────────────┘
             │
             ↓
PASO 5: Feedback y navegación
┌─────────────────────────────────┐
│ toast.success('Servicio creado')│
│ navigate('/servicios')          │
└─────────────────────────────────┘
```

**Código técnico:**

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Validación
  if (!validateRequiredFields(formData, ['title', 'description', 'category', 'address', 'city', 'preferredDate'])) {
    toast.error('Completa todos los campos');
    return;
  }

  if (insumos.length === 0) {
    toast.error('Agrega al menos un insumo');
    return;
  }

  // Construcción del objeto
  const newService: Service = {
    id: `srv-${Date.now()}-${Math.random()}`,
    solicitanteId: user!.id,
    solicitanteName: user!.name,
    title: formData.title,
    description: formData.description,
    category: formData.category as Service['category'],
    address: formData.address,
    city: formData.city,
    preferredDate: formData.preferredDate,
    insumos: insumos,
    status: 'publicado',
    createdAt: new Date().toISOString()
  };

  // Persistencia
  addService(newService);

  // Feedback
  toast.success('Servicio publicado exitosamente');
  navigate('/servicios');
};
```

### 5.3 Flujo: Cotizar Servicio

**Archivo:** `src/pages/cotizaciones/NuevaCotizacion.tsx`

```
┌─────────────────────────────────────────┐
│ Proveedor navega a /servicios/:id       │
│                ↓                         │
│ Visualiza ServicioDetail                │
│                ↓                         │
│ Click en "Enviar Cotización"            │
│                ↓                         │
│ Navigate to /servicios/:id/cotizar      │
└───────────────┬─────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────┐
│ NuevaCotizacion.tsx                     │
│                                         │
│ 1. useParams() → obtiene serviceId      │
│ 2. useData() → busca el servicio        │
│ 3. Verifica permisos:                   │
│    - role === 'proveedor_servicio'      │
│    - status === 'publicado'             │
│    - no hay cotización previa           │
│                                         │
│ 4. Renderiza formulario:                │
│    - Precio (UY)                       │
│    - Plazo (días)                       │
│    - Detalles (textarea)                │
│                                         │
│ 5. Al submit:                           │
│    a) Validación                        │
│    b) Crear objeto Quote                │
│    c) addQuote(quote)                   │
│    d) Actualiza estado del servicio:    │
│       'publicado' → 'en_evaluacion'     │
│    e) toast.success()                   │
│    f) navigate(`/servicios/${id}`)      │
└─────────────────────────────────────────┘
```

**Código técnico:**

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateRequiredFields(formData, ['price', 'deadline', 'details'])) {
    toast.error('Completa todos los campos');
    return;
  }

  const newQuote: Quote = {
    id: `quote-${Date.now()}-${Math.random()}`,
    serviceId: id!,
    providerId: user!.id,
    providerName: user!.name,
    price: parseFloat(formData.price),
    deadline: parseInt(formData.deadline),
    details: formData.details,
    createdAt: new Date().toISOString()
  };

  addQuote(newQuote);
  toast.success('Cotización enviada exitosamente');
  navigate(`/servicios/${id}`);
};
```

**Auto-actualización de estado del servicio:**
```typescript
// En DataContext.tsx
const addQuote = (quote: Quote) => {
  setQuotes(prev => [...prev, quote]);

  // Si es la primera cotización, cambiar estado
  const serviceQuotes = quotes.filter(q => q.serviceId === quote.serviceId);
  if (serviceQuotes.length === 0) {
    setServices(prev => prev.map(s =>
      s.id === quote.serviceId && s.status === 'publicado'
        ? { ...s, status: 'en_evaluacion' }
        : s
    ));
  }
};
```

### 5.4 Flujo: Comparar y Seleccionar Cotización

**Archivo:** `src/pages/servicios/ComparadorCotizaciones.tsx`

```
┌────────────────────────────────────────┐
│ Solicitante en ServicioDetail          │
│ (servicio en estado 'en_evaluacion')   │
│           ↓                             │
│ Click "Comparar Cotizaciones"          │
│           ↓                             │
│ Navigate /servicios/:id/comparar       │
└───────────┬────────────────────────────┘
            │
            ↓
┌─────────────────────────────────────────┐
│ ComparadorCotizaciones.tsx              │
│                                         │
│ 1. Obtiene todas las cotizaciones:     │
│    quotes.filter(q =>                   │
│      q.serviceId === id                 │
│    )                                    │
│                                         │
│ 2. Renderiza tabla comparativa:        │
│    ┌─────────┬────────┬────────┬────┐  │
│    │Provider │ Precio │ Plazo  │ ... │  │
│    ├─────────┼────────┼────────┼────┤  │
│    │ Prov A  │$50.000 │ 3 días │ ✓  │  │
│    │ Prov B  │$45.000 │ 5 días │ ✓  │  │
│    └─────────┴────────┴────────┴────┘  │
│                                         │
│ 3. Al click "Seleccionar":              │
│    a) selectQuote(serviceId, quoteId)   │
│    b) servicio.status → 'asignado'      │
│    c) servicio.assignedQuoteId → id     │
│    d) toast.success()                   │
│    e) navigate('/dashboard')            │
└─────────────────────────────────────────┘
```

**Código técnico:**

```typescript
const serviceQuotes = quotes.filter(q => q.serviceId === id);

const handleSelectQuote = (quoteId: string) => {
  if (confirm('¿Estás seguro de seleccionar esta cotización?')) {
    selectQuote(id!, quoteId);
    toast.success('Cotización seleccionada. El proveedor ha sido notificado.');
    navigate('/dashboard');
  }
};

return (
  <table>
    <thead>
      <tr>
        <th>Proveedor</th>
        <th>Precio</th>
        <th>Plazo</th>
        <th>Rating</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {serviceQuotes.map(quote => (
        <tr key={quote.id}>
          <td>{quote.providerName}</td>
          <td>{formatCurrency(quote.price)}</td>
          <td>{formatDeadline(quote.deadline)}</td>
          <td>⭐ {provider.rating}</td>
          <td>
            <Button onClick={() => handleSelectQuote(quote.id)}>
              Seleccionar
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
```

### 5.5 Flujo: Gestión de Insumos (CRUD Completo)

**Archivo:** `src/pages/insumos/InsumosList.tsx`

```
┌──────────────────────────────────────────┐
│ Proveedor de insumos accede a /insumos  │
└───────────┬──────────────────────────────┘
            │
            ↓
┌─────────────────────────────────────────┐
│ InsumosList.tsx                         │
│                                         │
│ ┌──────────────────┐                   │
│ │ [+ Agregar]      │ ← onClick →       │
│ └──────────────────┘   setShowForm()   │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Formulario (si showForm=true)   │    │
│ │ - Nombre                        │    │
│ │ - Categoría                     │    │
│ │ - Unidad                        │    │
│ │ - Precio unitario               │    │
│ │ - Stock                         │    │
│ │                                 │    │
│ │ [Cancelar] [Crear/Actualizar]   │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Tabla de Insumos                │    │
│ │ ┌────┬────────┬──────┬──────┐   │    │
│ │ │Nom │Categ   │Precio│Stock │   │    │
│ │ ├────┼────────┼──────┼──────┤   │    │
│ │ │... │...     │...   │ [✏️][🗑] │   │
│ │ └────┴────────┴──────┴──────┘   │    │
│ └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Operaciones CRUD:**

**CREATE:**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateRequiredFields(formData, ['name', 'unitPrice', 'stock'])) {
    toast.error('Completa todos los campos');
    return;
  }

  const newInsumo: Insumo = {
    id: `insumo-${Date.now()}-${Math.random()}`,
    name: formData.name,
    category: formData.category,
    unit: formData.unit,
    unitPrice: parseFloat(formData.unitPrice),
    stock: parseInt(formData.stock),
    providerId: user!.id
  };

  addInsumo(newInsumo);
  toast.success('Insumo creado correctamente');
  setShowForm(false);
  resetForm();
};
```

**UPDATE:**
```typescript
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

// En handleSubmit, si editingId existe:
if (editingId) {
  const updatedInsumo: Insumo = {
    id: editingId,
    ...formData,
    unitPrice: parseFloat(formData.unitPrice),
    stock: parseInt(formData.stock),
    providerId: user!.id
  };
  updateInsumo(updatedInsumo);
  toast.success('Insumo actualizado correctamente');
}
```

**DELETE:**
```typescript
const handleDelete = (id: string) => {
  if (confirm('¿Estás seguro de eliminar este insumo?')) {
    deleteInsumo(id);
    toast.success('Insumo eliminado correctamente');
  }
};
```

### 5.6 Manejo de Errores Frontend

**Niveles de manejo de errores:**

**1. Validación preventiva:**
```typescript
if (insumos.length === 0) {
  toast.error('Agrega al menos un insumo');
  return; // Previene el submit
}
```

**2. Try-Catch (localStorage):**
```typescript
try {
  localStorage.setItem(key, JSON.stringify(value));
} catch (e) {
  if (e instanceof DOMException && e.name === 'QuotaExceededError') {
    toast.error('Almacenamiento lleno. Limpia datos antiguos.');
  }
}
```

**3. Verificaciones de existencia:**
```typescript
const service = services.find(s => s.id === id);

if (!service) {
  return (
    <EmptyState
      title="Servicio no encontrado"
      description="El servicio no existe o fue eliminado"
      action={<Button onClick={() => navigate('/servicios')}>Volver</Button>}
    />
  );
}
```

**4. Permisos y roles:**
```typescript
if (!hasRole(user, 'proveedor_insumos')) {
  navigate('/');
  return null; // No renderiza la página
}
```

**Limitaciones:**
- No hay rollback de transacciones
- No hay logging de errores
- No hay monitoreo (Sentry, etc.)
- Errores de red no aplicables (no hay API)

---

## 6. LIMITACIONES TÉCNICAS DE LA DEMO

### 6.1 Persistencia y Almacenamiento

**❌ Sin persistencia real:**
- Datos almacenados solo en `localStorage` del navegador
- Se pierden al limpiar caché
- Límite de ~5-10MB según navegador
- No hay backup ni recuperación

**❌ Sin base de datos:**
- No existe DBMS (PostgreSQL, MySQL, MongoDB)
- No hay transacciones ACID
- No hay integridad referencial
- No hay índices para búsquedas eficientes

**❌ Sin sincronización multi-dispositivo:**
- Datos atados a un navegador específico
- No hay sincronización entre usuarios
- Cambios no se propagan en tiempo real

### 6.2 Autenticación y Seguridad

**❌ Sin autenticación real:**
- Usuarios hardcodeados en código fuente
- Passwords en texto plano (visible en DevTools)
- No hay hashing (bcrypt, argon2)
- No hay tokens (JWT, OAuth 2.0)
- No hay refresh tokens
- No hay expiración de sesiones

**❌ Sin autorización real:**
- Verificación de roles solo en frontend
- Bypasseable con DevTools
- No hay control de acceso en backend (porque no existe)

**❌ Sin seguridad:**
- No hay HTTPS (depende del hosting)
- No hay protección CSRF
- No hay protección XSS (React mitiga parcialmente)
- No hay rate limiting
- No hay CAPTCHA
- No hay 2FA
- No hay auditoría de acciones

### 6.3 Lógica de Negocio

**❌ Sin validaciones de servidor:**
- Todas las validaciones son en cliente
- Bypasseables con herramientas (Postman, curl)
- No hay validación de lógica de negocio compleja

**❌ Sin integraciones externas:**
- No hay pasarela de pagos (Transbank, Stripe)
- No hay envío de emails (SendGrid, Mailgun)
- No hay SMS (Twilio)
- No hay servicios de geolocalización real
- No hay webhooks

**❌ Sin notificaciones:**
- No hay notificaciones push
- No hay emails transaccionales
- No hay notificaciones en tiempo real (WebSockets)
- Solo toast notifications efímeras

**❌ Sin workflows complejos:**
- No hay estados intermedios complejos
- No hay rollback de operaciones
- No hay confirmaciones por email
- No hay verificación de identidad

### 6.4 Escalabilidad y Performance

**❌ No es escalable:**
- Toda la lógica en cliente
- Filtrado O(n) en cada render
- No hay paginación real (lazy loading)
- No hay caching inteligente
- No hay CDN
- No hay optimización de bundles grandes

**❌ Sin optimizaciones:**
- No hay memoización estratégica
- No hay virtualización de listas largas
- No hay code splitting agresivo
- No hay service workers (PWA)

**❌ Límites prácticos:**
- Máximo ~1000 servicios antes de lag
- No soporta concurrencia real
- No hay balanceo de carga

### 6.5 Funcionalidades Faltantes

**❌ Sin sistema de pagos:**
- No hay integración con Transbank/WebPay
- No hay gestión de transacciones
- No hay facturación
- No hay comisiones

**❌ Sin comunicación:**
- No hay chat entre usuarios
- No hay sistema de mensajería
- No hay videoconferencia

**❌ Sin geolocalización real:**
- Ciudades hardcodeadas en select
- No hay mapa interactivo
- No hay cálculo de distancias
- No hay optimización de rutas

**❌ Sin reporting:**
- No hay dashboard de analytics real
- No hay exportación a PDF/Excel
- No hay reportes personalizados
- Los "analytics" son cálculos en memoria

**❌ Sin administración:**
- No hay panel de admin
- No hay moderación de contenido
- No hay gestión de reportes/denuncias
- No hay configuración global

---

## 7. QUÉ SE NECESITARÍA PARA CONVERTIRLA EN UN SISTEMA REAL

### 7.1 Backend y Base de Datos

#### **Tecnologías Backend**

**Opción Java:**
```
Spring Boot 3.x
├── Spring Security (JWT + OAuth2)
├── Spring Data JPA
├── Spring Validation
├── Spring Mail
└── Spring WebSocket

Base de Datos:
├── PostgreSQL 15+ (principal)
├── Redis (cache + sesiones)
└── AWS S3 (archivos)
```

**Opción Node.js:**
```
Node.js 20+ LTS
├── Express.js o Fastify
├── Passport.js (autenticación)
├── TypeORM o Prisma
├── Bull (colas de trabajo)
└── Socket.io (tiempo real)

Base de Datos:
├── PostgreSQL o MySQL
├── Redis
└── S3-compatible storage
```

#### **Arquitectura Backend**

```
┌─────────────────────────────────────┐
│   Frontend (React + Vite)          │
└────────────┬────────────────────────┘
             │ HTTPS/REST API
             ↓
┌─────────────────────────────────────┐
│   API Gateway / Load Balancer      │
│   (NGINX, AWS ALB)                  │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│   Backend Servers (Scale horizontally)│
│   ┌─────────────────────────────┐   │
│   │ Capa de Autenticación       │   │
│   │ - JWT validation            │   │
│   │ - Rate limiting             │   │
│   └─────────────────────────────┘   │
│   ┌─────────────────────────────┐   │
│   │ Capa de Lógica de Negocio   │   │
│   │ - Servicios                 │   │
│   │ - Cotizaciones              │   │
│   │ - Insumos                   │   │
│   │ - Pagos                     │   │
│   └─────────────────────────────┘   │
│   ┌─────────────────────────────┐   │
│   │ Capa de Datos (Repositories)│   │
│   └─────────────────────────────┘   │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│   Base de Datos PostgreSQL          │
│   - Tablas normalizadas             │
│   - Índices optimizados             │
│   - Constraints de integridad       │
│   - Migraciones versionadas         │
└─────────────────────────────────────┘
```

#### **Esquema de Base de Datos**

```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  rating DECIMAL(3,2),
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_role CHECK (role IN ('solicitante', 'proveedor_servicio', 'proveedor_insumos'))
);

-- Servicios
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitante_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  preferred_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'publicado',
  assigned_quote_id UUID,
  rating INTEGER,
  rating_comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_status CHECK (status IN ('publicado', 'en_evaluacion', 'asignado', 'completado', 'cancelado'))
);

-- Índices
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_city ON services(city);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_created_at ON services(created_at DESC);

-- Insumos de servicio
CREATE TABLE service_insumos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) NOT NULL
);

-- Cotizaciones
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES users(id),
  price DECIMAL(10,2) NOT NULL,
  deadline INTEGER NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_provider_service UNIQUE (service_id, provider_id)
);

-- Insumos
CREATE TABLE insumos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Equivalencias
CREATE TABLE insumo_equivalencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES users(id),
  original_insumo_id UUID NOT NULL,
  proposed_insumo_id UUID NOT NULL REFERENCES insumos(id),
  reason TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packs de insumos
CREATE TABLE insumo_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE insumo_pack_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID NOT NULL REFERENCES insumo_packs(id) ON DELETE CASCADE,
  insumo_id UUID NOT NULL REFERENCES insumos(id),
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);
```

### 7.2 Autenticación y Seguridad

#### **Autenticación con JWT**

```typescript
// Backend: Generación de tokens
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepass123"
}

→ Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "...",
    "role": "..."
  }
}

// Frontend: Interceptor de axios
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token automático en 401
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

#### **Seguridad Adicional**

```
├── HTTPS obligatorio (TLS 1.3)
├── Helmet.js (headers de seguridad)
├── CORS configurado restrictivamente
├── Rate limiting (express-rate-limit)
│   └── 100 requests / 15 min por IP
├── Validación de entrada (Joi, Yup)
├── Sanitización (DOMPurify, xss)
├── CSRF tokens
├── Content Security Policy
└── Auditoría de acciones (logs)
```

### 7.3 Integraciones Externas

#### **Pagos con Transbank WebPay Plus**

```typescript
// Backend endpoint
POST /api/payments/initiate
{
  "quoteId": "uuid",
  "amount": 50000
}

→ Integración con Transbank:
1. Crear transacción
2. Redirigir a WebPay
3. Callback de confirmación
4. Actualizar estado en BD
5. Enviar email de confirmación
```

#### **Emails Transaccionales**

```typescript
// Con SendGrid o AWS SES
await sendEmail({
  to: user.email,
  template: 'service-created',
  data: {
    serviceName: service.title,
    serviceUrl: `https://app.com/servicios/${service.id}`
  }
});
```

#### **Notificaciones Push**

```typescript
// Con Firebase Cloud Messaging
await sendPushNotification({
  userId: providerId,
  title: 'Nueva oportunidad de cotización',
  body: `${service.title} - ${service.city}`,
  data: { serviceId: service.id }
});
```

### 7.4 DevOps y Deployment

#### **Infraestructura Recomendada**

```
AWS / Google Cloud / Azure
├── Compute
│   ├── EC2 / Cloud Run / App Service
│   └── Auto Scaling Groups
├── Database
│   ├── RDS PostgreSQL (Multi-AZ)
│   └── ElastiCache Redis
├── Storage
│   └── S3 / Cloud Storage (avatars, attachments)
├── CDN
│   └── CloudFront / Cloud CDN
├── Monitoring
│   ├── CloudWatch / Stackdriver
│   ├── Sentry (error tracking)
│   └── LogRocket (session replay)
└── CI/CD
    ├── GitHub Actions
    ├── Docker + Kubernetes
    └── Terraform (IaC)
```

#### **Pipeline CI/CD**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: aws-actions/configure-aws-credentials@v1
      - run: aws s3 sync build/ s3://app-bucket/
      - run: aws cloudfront create-invalidation

  build-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: docker build -t backend:${{ github.sha }} .
      - run: docker push registry/backend:${{ github.sha }}
      - run: kubectl set image deployment/backend backend=registry/backend:${{ github.sha }}
```

### 7.5 Estado Global Real

#### **Redux Toolkit (Recomendado)**

```typescript
// store/slices/servicesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchServices = createAsyncThunk(
  'services/fetchAll',
  async () => {
    const response = await api.get('/services');
    return response.data;
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchServices.pending, state => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
```

#### **React Query (Alternativa moderna)**

```typescript
import { useQuery, useMutation, useQueryClient } from 'react-query';

function useServices() {
  return useQuery('services', () => api.get('/services'));
}

function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation(
    (newService) => api.post('/services', newService),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('services');
      }
    }
  );
}
```

---

## 8. CONCLUSIÓN TÉCNICA

### 8.1 Cumplimiento de Objetivos

Este proyecto **cumple exitosamente su propósito como demostración funcional** de una plataforma marketplace de servicios. Técnicamente, demuestra:

✅ **Arquitectura SPA moderna** con React 18.3.1
✅ **Organización escalable** por features
✅ **Gestión de estado** con Context API + Custom Hooks
✅ **Enrutamiento completo** con protección de rutas
✅ **Sistema de diseño consistente** con Radix UI + Tailwind
✅ **Simulación realista** de flujos de marketplace
✅ **Código limpio** con TypeScript y utilidades reutilizables
✅ **Build optimizado** con Vite

### 8.2 Valor como Prototipo

**Funcionalidades Demostradas:**

1. **Multi-rol**: Solicitantes, proveedores de servicio y proveedores de insumos
2. **Flujos completos**: Desde publicación de servicio hasta selección de cotización
3. **CRUD completo**: Servicios, cotizaciones, insumos, packs, equivalencias
4. **UX funcional**: Formularios validados, feedback visual, navegación intuitiva
5. **Persistencia local**: Datos persisten entre recargas de página

**Lo que NO es:**

❌ No es un sistema de producción
❌ No tiene seguridad real
❌ No escala más allá de un usuario
❌ No tiene backend
❌ No tiene integración con servicios externos

### 8.3 Estado Técnico Actual

#### **Métricas del Proyecto:**

```
Páginas implementadas:    14
Componentes reutilizables: 30+
Utilidades:               15+
Líneas de código:         ~8,000
Tamaño del bundle:        346 KB (gzipped: 96 KB)
Tiempo de build:          ~4s
Tecnologías:              10+
```

#### **Cobertura Funcional:**

```
┌─────────────────────────────────┬─────────┐
│ Funcionalidad                   │ Estado  │
├─────────────────────────────────┼─────────┤
│ Autenticación simulada          │ ✅ 100% │
│ Gestión de servicios            │ ✅ 100% │
│ Gestión de cotizaciones         │ ✅ 100% │
│ Gestión de insumos              │ ✅ 100% │
│ Comparación de cotizaciones     │ ✅ 100% │
│ Packs de insumos                │ ✅ 100% │
│ Equivalencias de insumos        │ ✅ 100% │
│ Analytics básicos               │ ✅ 100% │
│ Persistencia local              │ ✅ 100% │
│ Navegación y rutas              │ ✅ 100% │
├─────────────────────────────────┼─────────┤
│ Backend real                    │ ❌  0%  │
│ Base de datos                   │ ❌  0%  │
│ Autenticación JWT               │ ❌  0%  │
│ Pasarela de pagos               │ ❌  0%  │
│ Emails transaccionales          │ ❌  0%  │
│ Notificaciones push             │ ❌  0%  │
│ Tests automatizados             │ ❌  0%  │
└─────────────────────────────────┴─────────┘
```

### 8.4 Próximos Pasos Técnicos

#### **Fase 1: Backend MVP (2-4 semanas)**
- Implementar API REST con Express/Spring Boot
- Configurar PostgreSQL + migraciones
- Implementar autenticación JWT
- CRUD de entidades principales

#### **Fase 2: Integraciones (2-3 semanas)**
- Integrar pasarela de pagos
- Implementar envío de emails
- Sistema de notificaciones

#### **Fase 3: Producción (2-3 semanas)**
- Tests unitarios e integración
- CI/CD pipeline
- Deployment a cloud
- Monitoreo y logging

#### **Fase 4: Optimizaciones (1-2 semanas)**
- Performance tuning
- SEO
- PWA capabilities
- Caching strategies

### 8.5 Reflexión Final

Esta demostración técnica **prueba la viabilidad** de un marketplace de servicios con las siguientes características:

**Fortalezas arquitecturales:**
- Separación clara de responsabilidades
- Código modular y reutilizable
- Fácil de extender con nuevas features
- Base sólida para migrar a backend real

**Limitaciones reconocidas:**
- No es un sistema de producción
- Requiere backend completo para ser real
- Persistencia temporal e insegura
- No escalable en estado actual

**Conclusión:** El proyecto cumple con los objetivos de una **demostración funcional frontend-only**, mostrando un diseño de interacciones completo, flujos de usuario bien definidos y una arquitectura técnica clara. Constituye una **base sólida** para evolucionar hacia un sistema real mediante la implementación de los componentes faltantes descritos en la sección 7.

---

**Fin del Informe Técnico**
*Generado el 25 de Noviembre, 2025*
*Proyecto: Servicombo Marketplace Demo*
*Versión: 0.1.0*
