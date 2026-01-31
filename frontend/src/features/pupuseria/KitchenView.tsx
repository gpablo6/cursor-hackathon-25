import { useState, useEffect } from 'react';
import { KitchenKanban } from './components/KitchenKanban';
import type { Order, OrderStatus } from '../../types/pupuseria';
import { toast } from 'sonner';
import { getPendingOrders, deleteOrder, completeOrder } from '../../services/ordersApi';

export function KitchenView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mergeStoredStatus = (fetchedOrders: Order[]) => {
    const stored = JSON.parse(localStorage.getItem('pupuseria-orders') || '[]') as Order[];
    const storedStatusMap = new Map(stored.map((order) => [order.id, order.status]));

    return fetchedOrders.map((order) => {
      const storedStatus = storedStatusMap.get(order.id);
      return storedStatus ? { ...order, status: storedStatus } : order;
    });
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await getPendingOrders();
        setOrders(mergeStoredStatus(fetchedOrders));
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar pedidos');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    loadOrders();

    // Poll for updates every 5 seconds
    const interval = setInterval(loadOrders, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Optimistic update
    const previousOrder = order;
    setOrders((current) =>
      current.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      // If status is 'listo' (completed), call the complete endpoint
      if (newStatus === 'listo') {
        await completeOrder(orderId);
        toast.success('¡Pedido listo para servir!', {
          description: `Mesa ${order.mesa}`,
        });
      } else {
        // For other status changes, we'll just keep the optimistic update
        // Backend only supports pending/in_progress/completed/cancelled
        // We can enhance this later if needed
        toast.success('Estado actualizado', {
          description: `Mesa ${order.mesa}`,
        });
      }
      
        // Update localStorage for compatibility
        const stored = JSON.parse(localStorage.getItem('pupuseria-orders') || '[]') as Order[];
        const updatedStored = stored.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        );
        localStorage.setItem('pupuseria-orders', JSON.stringify(updatedStored));
    } catch (err) {
      console.error('Error updating order status:', err);
      // Rollback optimistic update
      setOrders((current) =>
        current.map((o) => (o.id === orderId ? previousOrder : o))
      );
      toast.error('Error al actualizar el estado', {
        description: err instanceof Error ? err.message : 'Intenta de nuevo',
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Optimistic update
    setOrders((current) => current.filter((o) => o.id !== orderId));

    try {
      // Call backend API to delete/cancel the order
      await deleteOrder(orderId);

      // Remove from localStorage for compatibility
      const stored = JSON.parse(localStorage.getItem('pupuseria-orders') || '[]') as Order[];
      const updatedStored = stored.filter((o) => o.id !== orderId);
      localStorage.setItem('pupuseria-orders', JSON.stringify(updatedStored));

      // Trigger storage event to notify other components
      window.dispatchEvent(new Event('storage'));

      // Show toast notification
      toast.success('Pedido eliminado', {
        description: `Mesa ${order.mesa}`,
      });
    } catch (err) {
      console.error('Error deleting order:', err);
      // Rollback optimistic update
      setOrders((current) => {
        if (current.some((o) => o.id === orderId)) {
          return current;
        }
        return [...current, order].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );
      });
      toast.error('Error al eliminar el pedido', {
        description: err instanceof Error ? err.message : 'Intenta de nuevo',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pupuseria-crema flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pupuseria-maiz border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-pupuseria-chicharron font-semibold">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pupuseria-crema flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-pupuseria-chicharron mb-2">Error al cargar pedidos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-3d-primary px-6 py-2"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pupuseria-crema">
      <KitchenKanban
        orders={orders}
        onUpdateStatus={updateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
      />
    </div>
  );
}
