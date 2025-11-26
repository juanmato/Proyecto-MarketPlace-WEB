import { User } from '../types';

export type UserRole = 'solicitante' | 'proveedor_servicio' | 'proveedor_insumos';

/**
 * Verifica si un usuario tiene un rol específico
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  return user?.role === role;
}

/**
 * Verifica si un usuario tiene alguno de los roles especificados
 */
export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  return user ? roles.includes(user.role) : false;
}

/**
 * Verifica si un usuario es el dueño de un recurso
 */
export function isOwner(user: User | null, ownerId: string): boolean {
  return user?.id === ownerId;
}

/**
 * Verifica si un usuario puede cotizar un servicio
 */
export function canQuoteService(
  user: User | null,
  serviceStatus: string,
  existingQuotes: { providerId: string }[]
): boolean {
  if (!hasRole(user, 'proveedor_servicio')) return false;
  if (serviceStatus !== 'publicado') return false;
  if (!user) return false;

  return !existingQuotes.some(q => q.providerId === user.id);
}

/**
 * Verifica si un usuario puede crear un pack de insumos
 */
export function canCreateInsumoPack(user: User | null, serviceStatus: string): boolean {
  return hasRole(user, 'proveedor_insumos') &&
         serviceStatus !== 'completado' &&
         serviceStatus !== 'cancelado';
}

/**
 * Verifica si un usuario puede proponer equivalencias
 */
export function canProposeEquivalencias(
  user: User | null,
  serviceStatus: string,
  hasInsumos: boolean
): boolean {
  return hasRole(user, 'proveedor_insumos') &&
         serviceStatus !== 'completado' &&
         serviceStatus !== 'cancelado' &&
         hasInsumos;
}

/**
 * Verifica si un usuario puede completar un servicio
 */
export function canCompleteService(user: User | null, service: { solicitanteId: string; status: string }): boolean {
  return isOwner(user, service.solicitanteId) && service.status === 'asignado';
}

/**
 * Verifica si un usuario puede cancelar un servicio
 */
export function canCancelService(user: User | null, service: { solicitanteId: string; status: string }): boolean {
  return isOwner(user, service.solicitanteId) &&
         (service.status === 'publicado' || service.status === 'en_evaluacion');
}

/**
 * Verifica si un usuario puede editar una cotización
 */
export function canEditQuote(
  user: User | null,
  quote: { providerId: string } | undefined,
  serviceStatus: string
): boolean {
  if (!quote || !user) return false;
  return isOwner(user, quote.providerId) &&
         (serviceStatus === 'publicado' || serviceStatus === 'en_evaluacion');
}
