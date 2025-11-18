# ServiCombo - Marketplace de Servicios

Sistema de marketplace web que conecta tres tipos de usuarios: **Solicitantes**, **Proveedores de Servicio** y **Proveedores de Insumos**.

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Pasos para Ejecutar

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo
npm run dev

# 3. Abrir en el navegador
# La aplicación estará disponible en http://localhost:5173
```

## 👥 Usuarios Demo (Hardcoded)

La aplicación incluye usuarios de prueba hardcodeados. Usa cualquiera de estos para iniciar sesión:

### Solicitante
- **Email:** `juan@solicitante.com`
- **Password:** `123`
- **Rol:** Solicitante de Servicios

### Proveedor de Servicio #1
- **Email:** `maria@proveedor.com`
- **Password:** `123`
- **Rol:** Proveedor de Servicio

### Proveedor de Servicio #2
- **Email:** `ana@proveedor.com`
- **Password:** `123`
- **Rol:** Proveedor de Servicio

### Proveedor de Insumos
- **Email:** `carlos@insumos.com`
- **Password:** `123`
- **Rol:** Proveedor de Insumos

## 🎯 Funcionalidades por Rol

### 🏠 Solicitante
- ✅ Publicar servicios con insumos requeridos
- ✅ Ver listado de mis servicios con filtros
- ✅ Recibir y comparar cotizaciones
- ✅ Seleccionar cotización ganadora
- ✅ **Completar servicio y calificar proveedor con sistema de rating (1-5 estrellas)**
- ✅ Dashboard con métricas personalizadas
- ✅ Gestión de estados del servicio (Publicado → En Evaluación → Asignado → Completado)

### 🔧 Proveedor de Servicio
- ✅ Ver servicios disponibles con filtros avanzados
- ✅ Enviar cotizaciones (precio, plazo, detalles)
- ✅ **Editar cotizaciones (solo si servicio está en Publicado/En Evaluación)**
- ✅ Ver mis cotizaciones enviadas
- ✅ Eliminar cotizaciones (solo si servicio está en Publicado/En Evaluación)
- ✅ Dashboard con métricas de cotizaciones

### 📦 Proveedor de Insumos
- ✅ CRUD completo de catálogo de insumos
- ✅ Crear packs personalizados de insumos para servicios
- ✅ **Proponer equivalencias de insumos (productos alternativos)**
- ✅ Ver demanda de insumos en tiempo real
- ✅ Control de stock con alertas
- ✅ Dashboard con estadísticas de inventario

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **React Router** v6 para navegación
- **Tailwind CSS** v4 para estilos
- **Lucide React** para iconos
- **Sonner** para notificaciones toast

### Gestión de Estado
- **React Context API** para autenticación y estado global
- **useState** y **useReducer** para estado local y complejo
- **Custom Hook: useServicesReducer** - Maneja filtros, búsqueda y estado de servicios con reducer pattern
- **LocalStorage** para persistencia de sesión

### Estructura del Proyecto
```
/src
  /components
    /design-system      # Sistema de componentes reutilizables
    /layout            # Navbar y layout components
  /context             # AuthContext y otros contextos
  /data                # Mock data hardcoded
  /pages               # Páginas principales de la app
  /types               # TypeScript types e interfaces
  /styles              # Estilos globales
```

## 📋 Decisiones Técnicas

### 1. Context API vs Redux
**Decisión:** Usamos React Context API
**Razón:** Para una aplicación de esta escala, Context API es suficiente y evita la complejidad adicional de Redux. AuthContext maneja la autenticación y estado de usuario de forma simple y efectiva.

### 2. Mock Data vs Backend
**Decisión:** Mock data hardcoded en `/data/mockData.ts`
**Razón:** Facilita el desarrollo y testing sin necesidad de configurar un backend. Los datos se cargan instantáneamente y persisten durante la sesión.

### 3. LocalStorage para Sesión
**Decisión:** Guardar usuario actual en localStorage
**Razón:** Permite que la sesión persista entre recargas de página, mejorando la UX sin necesidad de re-autenticación constante.

### 4. TypeScript
**Decisión:** TypeScript en todo el proyecto
**Razón:** Proporciona type safety, mejor autocompletado, y reduce bugs en tiempo de desarrollo. Especialmente útil para definir interfaces de User, Service, Quote, etc.

### 5. Custom Hook con useReducer
**Decisión:** Implementar `useServicesReducer`
**Razón:** Para gestión de estado complejo en listado de servicios (filtros múltiples, búsqueda, sorting). useReducer facilita el manejo de múltiples acciones relacionadas y hace el código más predecible y testeable.

### 6. Design System
**Decisión:** Componentes reutilizables propios (Button, Input, Card, Badge, etc.)
**Razón:** Mantiene consistencia visual en toda la app y facilita cambios de diseño centralizados. Todos los componentes siguen la paleta de colores definida.

### 7. Routing Strategy
**Decisión:** Rutas protegidas con componente ProtectedRoute
**Razón:** Centraliza la lógica de protección de rutas y redirección. Si no hay usuario autenticado, automáticamente redirige a `/login`.

## 🎨 Paleta de Colores

- **Primario:** `#2563EB` (Azul profesional)
- **Secundario:** `#10B981` (Verde éxito)
- **Estados:**
  - Publicado: Azul `#3B82F6`
  - En Evaluación: Amarillo `#F59E0B`
  - Asignado: Morado `#8B5CF6`
  - Completado: Verde `#10B981`
  - Cancelado: Rojo `#EF4444`

## 🔐 Sistema de Autenticación

El sistema incluye:
- Validación de email y password
- Persistencia de sesión en localStorage
- Logout que limpia el estado
- Rutas protegidas que verifican autenticación
- Redirect automático según rol

## 📱 Responsive Design

La aplicación es completamente responsive:
- **Desktop First:** Diseño optimizado para pantallas grandes
- **Mobile Optimized:** Cards, tablas adaptativas, menú hamburguesa
- **Breakpoints:** Tailwind CSS breakpoints (sm, md, lg, xl)

## 🔄 Flujo de Trabajo

### Flujo del Solicitante
1. Login → Dashboard
2. Publicar Servicio (con insumos opcionales)
3. Recibir Cotizaciones
4. Comparar Cotizaciones (tabla con sorting)
5. Seleccionar Ganadora
6. Servicio cambia a "Asignado"
7. **Completar y Calificar (rating 1-5 estrellas + comentario)**

### Flujo del Proveedor de Servicio
1. Login → Dashboard
2. Ver Servicios Disponibles
3. Enviar Cotización
4. **Editar Cotización (si es necesario)**
5. Gestionar Mis Cotizaciones
6. Eliminar cotización si es necesario

### Flujo del Proveedor de Insumos
1. Login → Dashboard
2. Gestionar Catálogo de Insumos (CRUD)
3. Ver Demanda de Insumos
4. Crear Packs Personalizados
5. **Proponer Equivalencias de productos**
6. Ofertar pack a servicio específico

## 🧪 Testing

Para probar todas las funcionalidades:

1. **Login como Solicitante** (`juan@solicitante.com` / `123`)
   - Publica un nuevo servicio
   - Navega al detalle
   - Compara cotizaciones

2. **Login como Proveedor** (`maria@proveedor.com` / `123`)
   - Ve servicios disponibles
   - Envía una cotización
   - Ve tus cotizaciones en `/cotizaciones`

3. **Login como Proveedor Insumos** (`carlos@insumos.com` / `123`)
   - Gestiona tu catálogo
   - Ve la demanda de insumos
   - Crea un pack para un servicio

## 📦 Modelo de Datos

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'solicitante' | 'proveedor_servicio' | 'proveedor_insumos';
  avatar?: string;
  rating?: number;
  phone?: string;
}
```

### Service
```typescript
{
  id: string;
  title: string;
  description: string;
  category: 'jardineria' | 'piscinas' | 'limpieza' | 'otros';
  address: string;
  city: string;
  preferredDate: string;
  status: 'publicado' | 'en_evaluacion' | 'asignado' | 'completado' | 'cancelado';
  solicitanteId: string;
  insumos: { id: string; name: string; quantity: number; unit: string }[];
  assignedQuoteId?: string;
}
```

### Quote
```typescript
{
  id: string;
  serviceId: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  price: number;
  deadline: number; // días
  details: string;
  status: 'pendiente' | 'aceptada' | 'rechazada';
}
```

### Insumo
```typescript
{
  id: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  stock: number;
  providerId: string;
}
```

## 🚀 Próximos Pasos (Mejoras Futuras)

- [ ] Integración con backend real (API REST)
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat entre usuarios
- [ ] Sistema de reviews y ratings
- [ ] Pasarela de pagos
- [ ] Historial de transacciones
- [ ] Reportes y analytics avanzados
- [ ] App móvil con React Native

## 📄 Licencia

Este proyecto es un MVP de demostración para ServiCombo.

---

**Desarrollado con ❤️ usando React + TypeScript + Tailwind CSS**