import { Button } from '../design-system/Button';

interface FormActionsProps {
  onCancel: () => void;
  onSecondary?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  secondaryLabel?: string;
  isSubmitting?: boolean;
}

export function FormActions({
  onCancel,
  onSecondary,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  secondaryLabel = 'Guardar Borrador',
  isSubmitting = false
}: FormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>
      {onSecondary && (
        <Button
          type="button"
          variant="ghost"
          onClick={onSecondary}
          disabled={isSubmitting}
        >
          {secondaryLabel}
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : submitLabel}
      </Button>
    </div>
  );
}
