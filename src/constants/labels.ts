import { ServiceStatus } from '../types';

export const STATUS_LABELS: Record<ServiceStatus, string> = {
  publicado: 'Publicado',
  en_evaluacion: 'En Evaluación',
  asignado: 'Asignado',
  completado: 'Completado',
  cancelado: 'Cancelado'
};

export const CATEGORY_LABELS: Record<string, string> = {
  jardineria: 'Jardinería',
  piscinas: 'Piscinas',
  limpieza: 'Limpieza',
  otros: 'Otros'
};
