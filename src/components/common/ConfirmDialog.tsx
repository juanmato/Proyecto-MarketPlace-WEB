/**
 * Muestra un diálogo de confirmación nativo del navegador
 * Puede ser reemplazado por un componente modal personalizado en el futuro
 */
export function confirm(message: string): boolean {
  return window.confirm(message);
}

/**
 * Mensajes de confirmación predefinidos
 */
export const CONFIRM_MESSAGES = {
  deleteQuote: '¿Estás seguro de que deseas eliminar tu cotización?',
  deleteInsumo: '¿Estás seguro de que deseas eliminar este insumo?',
  cancelService: '¿Estás seguro de que deseas cancelar este servicio? Esta acción no se puede deshacer.',
  selectQuote: '¿Estás seguro de seleccionar esta cotización? El servicio pasará a estado "Asignado".',
  deleteService: '¿Estás seguro de que deseas eliminar este servicio?',
  unsavedChanges: '¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.'
};
