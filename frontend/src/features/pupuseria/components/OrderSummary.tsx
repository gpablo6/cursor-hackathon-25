import { Send, X, Trash2 } from 'lucide-react';
import type { OrderItem } from '../../../types/pupuseria';
import { useState } from 'react';
import { ConfirmModal } from './ConfirmModal';

interface OrderSummaryProps {
  orderItems: OrderItem[];
  total: number;
  selectedMesa: number | null;
  onRemoveItem: (itemId: string) => void;
  onAddItem: (itemId: string) => void;
  onUpdateNotes: (itemId: string, notes: string) => void;
  onSendToKitchen: () => void;
  onClearOrder?: () => void;
  globalNotes?: string;
  onGlobalNotesChange?: (notes: string) => void;
}

export function OrderSummary({
  orderItems,
  total,
  selectedMesa,
  onRemoveItem,
  onSendToKitchen,
  onClearOrder,
  globalNotes = '',
  onGlobalNotesChange,
}: OrderSummaryProps) {
  const [showClearModal, setShowClearModal] = useState(false);

  return (
    <div className="card-elevated h-full flex flex-col overflow-hidden">
      {orderItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center flex-1">
          <div className="mb-3">
            <div className="w-16 h-16 bg-pupuseria-maiz/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">🫓</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">
            {!selectedMesa ? 'Selecciona una mesa' : 'Agrega pupusas al pedido'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-hidden">
          <div className="mb-4 flex-shrink-0 flex items-center justify-between">
            <div>
              {selectedMesa ? (
                <h2 className="text-xl font-bold text-pupuseria-chicharron">
                  Mesa {selectedMesa}
                </h2>
              ) : (
                <div>
                  <h2 className="text-lg font-bold text-pupuseria-chicharron mb-1">
                    Pedido
                  </h2>
                  <p className="text-xs text-pupuseria-salsa font-medium">
                    Selecciona una mesa para enviar
                  </p>
                </div>
              )}
            </div>
            {onClearOrder && orderItems.length > 0 && (
              <button
                onClick={() => setShowClearModal(true)}
                className="text-pupuseria-salsa hover:bg-pupuseria-salsa/10 rounded p-2 transition-colors"
                title="Eliminar pedido completo"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-2 mb-4 flex-1 min-h-0 overflow-y-auto scroll-horizontal-touch">
            {orderItems.map(item => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-2xl">{item.pupusa.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-pupuseria-chicharron">
                          {item.cantidad}x {item.pupusa.nombre}
                        </span>
                      </div>
                      <p className="text-pupuseria-maiz font-bold text-sm">
                        ${(item.pupusa.precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-pupuseria-salsa hover:bg-pupuseria-salsa/10 rounded p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-3 mb-3 flex-shrink-0">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-pupuseria-chicharron">
                Total:
              </span>
              <span className="text-xl font-extrabold text-pupuseria-maiz">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Special Notes */}
          {onGlobalNotesChange && (
            <div className="mb-3 flex-shrink-0">
              <textarea
                placeholder='Notas (ej: "bien dorada")'
                value={globalNotes}
                onChange={(e) => onGlobalNotesChange(e.target.value)}
                className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-pupuseria-maiz focus:border-pupuseria-maiz resize-none"
                rows={1}
              />
            </div>
          )}

          <button
            onClick={onSendToKitchen}
            disabled={!selectedMesa || orderItems.length === 0}
            className="btn-3d-primary w-full flex items-center justify-center gap-2 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4" />
            Enviar a Cocina
          </button>
        </div>
      )}

      {/* Clear Order Confirmation Modal */}
      {onClearOrder && (
        <ConfirmModal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          onConfirm={onClearOrder}
          title="¿Eliminar pedido?"
          message="¿Estás seguro de que deseas eliminar todo el pedido? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
        />
      )}
    </div>
  );
}
