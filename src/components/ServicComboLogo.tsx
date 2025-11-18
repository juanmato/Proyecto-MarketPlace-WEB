import { Home, Wrench, Package } from 'lucide-react';

interface ServicComboLogoProps {
  size?: 'small' | 'medium' | 'large';
  iconOnly?: boolean;
}

export function ServicComboLogo({ size = 'medium', iconOnly = false }: ServicComboLogoProps) {
  const dimensions = {
    small: { container: 120, icon: 64, text: 24, spacing: 8 },
    medium: { container: 180, icon: 96, text: 36, spacing: 12 },
    large: { container: 240, icon: 128, text: 48, spacing: 16 }
  };

  const config = dimensions[size];

  return (
    <div className="flex items-center gap-4" style={{ gap: `${config.spacing}px` }}>
      {/* Isotipo - Círculo dividido en 3 piezas */}
      <div style={{ width: config.icon, height: config.icon, position: 'relative' }}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Círculo de fondo sutil */}
          <circle cx="100" cy="100" r="95" fill="#f1f5f9" opacity="0.5" />
          
          {/* Pieza 1 - Azul (Solicitante - Casa) - Top */}
          <path
            d="M 100 100 L 100 15 A 85 85 0 0 1 173.7 50 Z"
            fill="#3b82f6"
            className="transition-all hover:opacity-90"
          />
          
          {/* Pieza 2 - Verde (Proveedor de Servicio - Llave) - Bottom Left */}
          <path
            d="M 100 100 L 26.3 50 A 85 85 0 0 0 26.3 150 Z"
            fill="#10b981"
            className="transition-all hover:opacity-90"
          />
          
          {/* Pieza 3 - Naranja (Proveedor de Insumos - Caja) - Bottom Right */}
          <path
            d="M 100 100 L 173.7 150 A 85 85 0 0 0 173.7 50 Z"
            fill="#f97316"
            className="transition-all hover:opacity-90"
          />

          {/* Círculo central blanco */}
          <circle cx="100" cy="100" r="35" fill="white" />
          
          {/* Líneas de separación sutiles */}
          <line x1="100" y1="100" x2="100" y2="15" stroke="white" strokeWidth="3" />
          <line x1="100" y1="100" x2="26.3" y2="50" stroke="white" strokeWidth="3" />
          <line x1="100" y1="100" x2="173.7" y2="150" stroke="white" strokeWidth="3" />

          {/* Iconos en cada sección */}
          {/* Casa - Top */}
          <g transform="translate(100, 40)">
            <path
              d="M -8 0 L 0 -6 L 8 0 L 8 8 L -8 8 Z M -4 8 L -4 2 L 4 2 L 4 8"
              fill="white"
              stroke="white"
              strokeWidth="1"
            />
          </g>

          {/* Llave inglesa - Bottom Left */}
          <g transform="translate(50, 125)">
            <rect x="-8" y="-2" width="16" height="4" fill="white" rx="1" />
            <rect x="-10" y="-4" width="4" height="8" fill="white" rx="1" />
            <rect x="6" y="-4" width="4" height="8" fill="white" rx="1" />
          </g>

          {/* Caja - Bottom Right */}
          <g transform="translate(150, 125)">
            <rect x="-8" y="-6" width="16" height="12" fill="white" stroke="white" strokeWidth="1.5" rx="1" />
            <line x1="-8" y1="-2" x2="8" y2="-2" stroke="white" strokeWidth="1.5" />
            <line x1="0" y1="-6" x2="0" y2="-2" stroke="white" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* Logotipo (texto) */}
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-baseline" style={{ fontSize: `${config.text}px` }}>
            <span className="text-blue-600" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              Servi
            </span>
            <span className="text-orange-600" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              Combo
            </span>
          </div>
          <span 
            className="text-slate-500 tracking-wide" 
            style={{ 
              fontSize: `${config.text * 0.3}px`,
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              marginTop: `-${config.text * 0.1}px`
            }}
          >
            Ecosistema de servicios
          </span>
        </div>
      )}
    </div>
  );
}
