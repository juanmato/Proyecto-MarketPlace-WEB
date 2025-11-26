interface Insumo {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

interface InsumosListProps {
  insumos: Insumo[];
  showTitle?: boolean;
  compact?: boolean;
}

export function InsumosList({ insumos, showTitle = true, compact = false }: InsumosListProps) {
  if (insumos.length === 0) return null;

  return (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      {showTitle && (
        <p className={`${compact ? 'text-xs' : 'text-sm'} text-slate-600 mb-2`}>
          Insumos requeridos:
        </p>
      )}
      <ul className={`${compact ? 'text-xs' : 'text-sm'} text-slate-500 space-y-1`}>
        {insumos.map((insumo) => (
          <li key={insumo.id}>
            • {insumo.name} ({insumo.quantity} {insumo.unit})
          </li>
        ))}
      </ul>
    </div>
  );
}
