export const CATEGORY_OPTIONS = [
  { value: 'jardineria', label: 'Jardinería' },
  { value: 'piscinas', label: 'Piscinas' },
  { value: 'limpieza', label: 'Limpieza' },
  { value: 'otros', label: 'Otros' }
];

export const CITY_OPTIONS = [
  { value: 'Santiago', label: 'Santiago' },
  { value: 'Valparaíso', label: 'Valparaíso' },
  { value: 'Concepción', label: 'Concepción' },
  { value: 'La Serena', label: 'La Serena' },
  { value: 'Temuco', label: 'Temuco' }
];

export const CITY_FILTER_OPTIONS = [
  { value: 'all', label: 'Todas las ciudades' },
  ...CITY_OPTIONS
];

export const UNIT_OPTIONS = [
  { value: 'unidades', label: 'Unidades' },
  { value: 'kg', label: 'Kilogramos' },
  { value: 'litros', label: 'Litros' },
  { value: 'metros', label: 'Metros' },
  { value: 'bolsas', label: 'Bolsas' }
];

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'publicado', label: 'Publicado' },
  { value: 'en_evaluacion', label: 'En Evaluación' },
  { value: 'asignado', label: 'Asignado' },
  { value: 'completado', label: 'Completado' },
  { value: 'cancelado', label: 'Cancelado' }
];

export const CATEGORY_FILTER_OPTIONS = [
  { value: 'all', label: 'Todas las categorías' },
  ...CATEGORY_OPTIONS
];
