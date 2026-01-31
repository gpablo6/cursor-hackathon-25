import { Clock, AlertCircle, ChefHat, CheckCircle, ArrowLeft, Trash2 } from 'lucide-react';
import type { Order, OrderStatus, OrderItem } from '../../../types/pupuseria';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { ConfirmModal } from './ConfirmModal';

interface KitchenKanbanProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
}

export function KitchenKanban({ orders, onUpdateStatus, onDeleteOrder }: KitchenKanbanProps) {
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<OrderStatus | null>(null);

  const columns = [
    {
      id: 'pendiente' as OrderStatus,
      title: 'EN COLA',
      color: 'bg-pupuseria-salsa',
      textColor: 'text-white',
      icon: AlertCircle,
      emptyIcon: AlertCircle,
    },
    {
      id: 'preparando' as OrderStatus,
      title: 'PREPARANDO',
      color: 'bg-pupuseria-maiz',
      textColor: 'text-white',
      icon: ChefHat,
      emptyIcon: ChefHat,
    },
    {
      id: 'listo' as OrderStatus,
      title: 'LISTO',
      color: 'bg-pupuseria-curtido',
      textColor: 'text-white',
      icon: CheckCircle,
      emptyIcon: CheckCircle,
    },
  ];

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(o => o.status === status);
  };

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    setDraggedOrderId(orderId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', orderId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: OrderStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: OrderStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedOrderId) {
      const order = orders.find(o => o.id === draggedOrderId);
      if (order && order.status !== targetStatus) {
        onUpdateStatus(draggedOrderId, targetStatus);
      }
    }
    
    setDraggedOrderId(null);
  };

  return (
    <div className="h-[calc(100vh-80px)] p-6 bg-pupuseria-crema overflow-hidden">
      <div className="grid grid-cols-3 gap-6 h-full">
        {columns.map(column => {
          const columnOrders = getOrdersByStatus(column.id);
          const Icon = column.icon;
          const EmptyIcon = column.emptyIcon;
          
          return (
            <div 
              key={column.id} 
              className="flex flex-col h-full overflow-hidden"
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header - Minimalist */}
              <div className={`bg-white border border-neutral-border rounded-xl p-4 mb-4 flex items-center justify-between transition-all ${
                dragOverColumn === column.id ? 'border-pupuseria-maiz border-2 bg-pupuseria-maiz/10' : ''
              }`}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${column.id === 'pendiente' ? 'text-pupuseria-salsa' : column.id === 'preparando' ? 'text-pupuseria-maiz' : 'text-pupuseria-curtido'}`} />
                  <h2 className="text-lg font-bold text-primary">
                    {column.title}
                  </h2>
                </div>
                <div className="bg-neutral-disabled-bg rounded-full px-3 py-1">
                  <span className="font-bold text-sm text-primary">{columnOrders.length}</span>
                </div>
              </div>

              {/* Orders */}
              <div className="space-y-3 flex-1 min-h-0 overflow-y-auto scroll-horizontal-touch">
                {columnOrders.length === 0 ? (
                  <div className={`card-elevated p-8 text-center transition-all ${
                    dragOverColumn === column.id ? 'border-2 border-pupuseria-maiz border-dashed bg-pupuseria-maiz/5' : ''
                  }`}>
                    <EmptyIcon className="w-12 h-12 text-neutral-disabled-text mx-auto mb-3" />
                    <p className="text-secondary text-sm font-medium">Sin pedidos</p>
                  </div>
                ) : (
                columnOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={onUpdateStatus}
                    onDeleteOrder={onDeleteOrder}
                    onDragStart={handleDragStart}
                    isDragging={draggedOrderId === order.id}
                  />
                ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onDragStart: (e: React.DragEvent, orderId: string) => void;
  isDragging: boolean;
}

function OrderCard({ order, onUpdateStatus, onDeleteOrder, onDragStart, isDragging }: OrderCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const timeAgo = formatDistanceToNow(order.timestamp, {
    addSuffix: true,
  });

  const getActionButtons = () => {
    const buttons = [];
    
    // Forward buttons
    if (order.status === 'pendiente') {
      buttons.push(
        <button
          key="preparar"
          onClick={() => onUpdateStatus(order.id, 'preparando')}
          className="w-full px-4 py-3 rounded-xl border border-neutral-border bg-surface text-primary font-medium text-sm shadow-[0_4px_0_0_#D4CBC0] hover:bg-app active:translate-y-0.5 active:shadow-[0_2px_0_0_#D4CBC0] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ChefHat className="w-4 h-4" />
          PREPARAR
        </button>
      );
    }
    if (order.status === 'preparando') {
      buttons.push(
        <button
          key="listo"
          onClick={() => onUpdateStatus(order.id, 'listo')}
          className="w-full px-4 py-3 rounded-xl bg-action-green text-white font-medium text-sm shadow-[0_4px_0_0_#2d7550] hover:bg-action-green-hover active:translate-y-0.5 active:shadow-[0_2px_0_0_#2d7550] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          LISTO
        </button>
      );
    }
    // Removed PAGAR button - payment is handled by waiter from MesaSelector

    // Backward buttons
    if (order.status === 'preparando') {
      buttons.push(
        <button
          key="volver-cola"
          onClick={() => onUpdateStatus(order.id, 'pendiente')}
          className="w-full px-4 py-2 rounded-xl border border-neutral-border bg-surface text-secondary font-medium text-xs shadow-[0_3px_0_0_#D4CBC0] hover:bg-app active:translate-y-0.5 active:shadow-[0_1px_0_0_#D4CBC0] transition-all duration-200 flex items-center justify-center gap-2 mt-2"
        >
          <ArrowLeft className="w-3 h-3" />
          VOLVER A COLA
        </button>
      );
    }
    if (order.status === 'listo') {
      buttons.push(
        <button
          key="volver-preparando"
          onClick={() => onUpdateStatus(order.id, 'preparando')}
          className="w-full px-4 py-2 rounded-xl border border-neutral-border bg-surface text-secondary font-medium text-xs shadow-[0_3px_0_0_#D4CBC0] hover:bg-app active:translate-y-0.5 active:shadow-[0_1px_0_0_#D4CBC0] transition-all duration-200 flex items-center justify-center gap-2 mt-2"
        >
          <ArrowLeft className="w-3 h-3" />
          VOLVER A PREPARAR
        </button>
      );
    }

    return buttons;
  };

  return (
    <div 
      className={`card-elevated cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-lg'
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, order.id)}
    >
      {/* Mesa Badge - Minimalist with Delete button */}
      <div className="flex items-center justify-between mb-3">
        <div className="bg-neutral-disabled-bg rounded-lg px-3 py-1.5">
          <span className="text-lg font-bold text-primary">Mesa {order.mesa}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-secondary text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">{timeAgo}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className="text-pupuseria-salsa hover:bg-pupuseria-salsa/10 rounded p-1.5 transition-colors"
            title="Eliminar pedido"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Items - Minimalist PUPAS style */}
      <div className="space-y-2 mb-3">
        {order.items.map((item: OrderItem) => (
          <div
            key={item.id}
            className="flex items-start justify-between bg-white/60 px-3 py-2 rounded-lg border border-neutral-border"
          >
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <span className="text-base shrink-0">{item.pupusa.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-primary font-medium text-sm">
                  {item.cantidad}x {item.pupusa.nombre}
                </div>
                {item.notas && (
                  <div className="text-secondary text-xs mt-0.5">
                    📝 {item.notas}
                  </div>
                )}
              </div>
            </div>
            <div className="text-action-green font-semibold text-xs shrink-0">
              ${(item.pupusa.precio * item.cantidad).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Total - Minimalist */}
      <div className="border-t border-neutral-border pt-3 mb-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm text-primary">
            Total:
          </span>
          <span className="text-lg font-extrabold text-action-green">
            ${order.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {getActionButtons()}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDeleteOrder(order.id)}
        title="¿Eliminar pedido?"
        message={`¿Estás seguro de que deseas eliminar el pedido de la Mesa ${order.mesa}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
