import { useState, useEffect } from 'react';
import { KitchenKanban } from './components/KitchenKanban';
import type { Order, OrderStatus } from '../../types/pupuseria';
import { toast } from 'sonner';

export function KitchenView() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = () => {
      const stored = localStorage.getItem('pupuseria-orders');
      if (stored) {
        const parsed = JSON.parse(stored) as Order[];
        // Convert timestamp strings back to Date objects
        const ordersWithDates = parsed.map((o) => ({
          ...o,
          timestamp: new Date(o.timestamp),
        }));
        setOrders(ordersWithDates);
      }
    };

    loadOrders();
    // Poll for updates every 2 seconds
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const updated = orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    
    // Update localStorage
    const stored = JSON.parse(localStorage.getItem('pupuseria-orders') || '[]') as Order[];
    const updatedStored = stored.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    localStorage.setItem('pupuseria-orders', JSON.stringify(updatedStored));

    // Show toast notification
    if (newStatus === 'listo') {
      toast.success('¡Pedido listo para servir!', {
        description: `Mesa ${order.mesa}`,
      });
    }
  };

  const deleteOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Remove order from state
    const updated = orders.filter(o => o.id !== orderId);
    setOrders(updated);
    
    // Remove from localStorage
    const stored = JSON.parse(localStorage.getItem('pupuseria-orders') || '[]') as Order[];
    const updatedStored = stored.filter((o) => o.id !== orderId);
    localStorage.setItem('pupuseria-orders', JSON.stringify(updatedStored));

    // Trigger storage event to notify other components
    window.dispatchEvent(new Event('storage'));

    // Show toast notification
    toast.success('Pedido eliminado', {
      description: `Mesa ${order.mesa}`,
    });
  };

  return (
    <div className="min-h-screen bg-pupuseria-crema">
      <KitchenKanban
        orders={orders}
        onUpdateStatus={updateOrderStatus}
        onDeleteOrder={deleteOrder}
      />
    </div>
  );
}
