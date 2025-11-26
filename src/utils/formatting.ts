/**
 * Formatea una fecha a string localizado en español chileno
 */
export function formatDate(date: string | Date, includeTime = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (includeTime) {
    return dateObj.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return dateObj.toLocaleDateString('es-CL');
}

/**
 * Formatea una fecha con formato extendido (mes en texto)
 */
export function formatDateLong(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formatea un número como moneda chilena (CLP)
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-CL')}`;
}

/**
 * Formatea un plazo en días con la palabra correcta (día/días)
 */
export function formatDeadline(days: number): string {
  return `${days} ${days === 1 ? 'día' : 'días'}`;
}

/**
 * Formatea un número de items con la palabra correcta (insumo/insumos, cotización/cotizaciones, etc.)
 */
export function formatCount(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
