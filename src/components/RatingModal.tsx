import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from './design-system/Button';
import { Textarea } from './design-system/Textarea';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  providerName: string;
}

export function RatingModal({ isOpen, onClose, onSubmit, providerName }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }
    onSubmit(rating, comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-xl text-slate-900">Calificar Servicio</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div>
            <p className="text-slate-600 mb-4">
              ¿Cómo fue tu experiencia con <span className="font-semibold text-slate-900">{providerName}</span>?
            </p>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-slate-500">
              {rating === 0 && 'Selecciona una calificación'}
              {rating === 1 && 'Muy insatisfecho'}
              {rating === 2 && 'Insatisfecho'}
              {rating === 3 && 'Neutral'}
              {rating === 4 && 'Satisfecho'}
              {rating === 5 && '¡Excelente!'}
            </p>
          </div>

          <Textarea
            label="Comentario (opcional)"
            placeholder="Cuéntanos más sobre tu experiencia..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            Enviar Calificación
          </Button>
        </div>
      </div>
    </div>
  );
}
