/**
 * Valida que todos los campos del formulario estén completos
 * @returns true si es válido, false si no lo es
 */
export function validateRequiredFields(data: Record<string, any>, fields: string[]): boolean {
  return fields.every(field => {
    const value = data[field];
    return value !== null && value !== undefined && value !== '';
  });
}

/**
 * Valida un formulario y retorna el primer error encontrado
 */
export function validateForm(data: Record<string, any>, rules: Record<string, ValidationRule>): string | null {
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];

    if (rule.required && (value === null || value === undefined || value === '')) {
      return rule.message || `El campo ${field} es requerido`;
    }

    if (rule.min !== undefined && Number(value) < rule.min) {
      return rule.message || `El valor mínimo para ${field} es ${rule.min}`;
    }

    if (rule.max !== undefined && Number(value) > rule.max) {
      return rule.message || `El valor máximo para ${field} es ${rule.max}`;
    }

    if (rule.pattern && !rule.pattern.test(String(value))) {
      return rule.message || `El formato de ${field} es inválido`;
    }

    if (rule.custom && !rule.custom(value)) {
      return rule.message || `El valor de ${field} es inválido`;
    }
  }

  return null;
}

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

/**
 * Convierte valores de formulario a sus tipos correctos
 */
export function parseFormValues<T extends Record<string, any>>(
  formData: Record<string, string>,
  schema: Record<keyof T, 'string' | 'number' | 'boolean'>
): Partial<T> {
  const result: any = {};

  for (const [key, type] of Object.entries(schema)) {
    const value = formData[key];

    if (value === undefined || value === null) continue;

    switch (type) {
      case 'number':
        result[key] = parseFloat(value);
        break;
      case 'boolean':
        result[key] = value === 'true' || value === true;
        break;
      default:
        result[key] = value;
    }
  }

  return result;
}
