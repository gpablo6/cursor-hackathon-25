import { useState } from 'react';
import { MesaSelector } from './components/MesaSelector';
import { MenuPupusas } from './components/MenuPupusas';
import { OrderSummary } from './components/OrderSummary';
import type { Order, OrderItem, MenuItemType } from '../../types/pupuseria';
import { toast } from 'sonner';

// Complete menu from PUPAS - All pupusas and beverages
const MENU_ITEMS: MenuItemType[] = [
  // Pupusas (26 items)
  { id: 'p1', nombre: 'Frijol', precio: 1.00, emoji: '🫘', categoria: 'pupusa' },
  { id: 'p2', nombre: 'Revueltas', precio: 1.25, emoji: '🥓', categoria: 'pupusa' },
  { id: 'p3', nombre: 'Queso', precio: 1.00, emoji: '🧀', categoria: 'pupusa' },
  { id: 'p4', nombre: 'Jalapeño', precio: 1.50, emoji: '🌶️', categoria: 'pupusa' },
  { id: 'p5', nombre: 'Chicharrón', precio: 1.25, emoji: '🐷', categoria: 'pupusa' },
  { id: 'p6', nombre: 'Cochinito', precio: 1.25, emoji: '🐖', categoria: 'pupusa' },
  { id: 'p7', nombre: 'Chorizo', precio: 1.25, emoji: '🌭', categoria: 'pupusa' },
  { id: 'p8', nombre: 'Loroco', precio: 1.50, emoji: '🌸', categoria: 'pupusa' },
  { id: 'p9', nombre: 'Papelillo', precio: 1.50, emoji: '🌿', categoria: 'pupusa' },
  { id: 'p10', nombre: 'Mora', precio: 1.50, emoji: '🫐', categoria: 'pupusa' },
  { id: 'p11', nombre: 'Mango', precio: 1.50, emoji: '🥭', categoria: 'pupusa' },
  { id: 'p12', nombre: 'Camarón', precio: 1.75, emoji: '🦐', categoria: 'pupusa' },
  { id: 'p13', nombre: 'Pescado', precio: 1.75, emoji: '🐟', categoria: 'pupusa' },
  { id: 'p14', nombre: 'Ajo', precio: 1.25, emoji: '🧄', categoria: 'pupusa' },
  { id: 'p15', nombre: 'Jamón', precio: 1.25, emoji: '🍖', categoria: 'pupusa' },
  { id: 'p16', nombre: 'Pepperoni', precio: 1.50, emoji: '🍕', categoria: 'pupusa' },
  { id: 'p17', nombre: 'Hongo / Champiñón', precio: 1.50, emoji: '🍄', categoria: 'pupusa' },
  { id: 'p18', nombre: 'Loca', precio: 1.25, emoji: '🌮', categoria: 'pupusa' },
  { id: 'p19', nombre: 'Pollo', precio: 1.25, emoji: '🍗', categoria: 'pupusa' },
  { id: 'p20', nombre: 'Carne', precio: 1.25, emoji: '🥩', categoria: 'pupusa' },
  { id: 'p21', nombre: 'Ayote', precio: 1.25, emoji: '🎃', categoria: 'pupusa' },
  { id: 'p22', nombre: 'Piña', precio: 1.50, emoji: '🍍', categoria: 'pupusa' },
  { id: 'p23', nombre: 'Jocote', precio: 1.50, emoji: '🍑', categoria: 'pupusa' },
  { id: 'p24', nombre: 'Garrobo', precio: 1.75, emoji: '🦎', categoria: 'pupusa' },
  { id: 'p25', nombre: 'Cusuco', precio: 1.75, emoji: '🦔', categoria: 'pupusa' },
  { id: 'p26', nombre: 'Conejo', precio: 1.75, emoji: '🐰', categoria: 'pupusa' },

  // Bebidas - Sodas
  { id: 'b1', nombre: 'Coca-Cola', precio: 1.50, emoji: '🥤', categoria: 'bebida' },
  { id: 'b2', nombre: 'Coca-Cola Light', precio: 1.50, emoji: '🥤', categoria: 'bebida' },
  { id: 'b3', nombre: 'Pepsi', precio: 1.50, emoji: '🥤', categoria: 'bebida' },
  { id: 'b4', nombre: 'Mirinda', precio: 1.50, emoji: '🥤', categoria: 'bebida' },
  { id: 'b5', nombre: 'Fanta Naranja', precio: 1.50, emoji: '🧃', categoria: 'bebida' },
  { id: 'b6', nombre: 'Fresca', precio: 1.50, emoji: '🥤', categoria: 'bebida' },
  { id: 'b7', nombre: 'Sprite', precio: 1.50, emoji: '🥤', categoria: 'bebida' },
  { id: 'b8', nombre: '7Up', precio: 1.50, emoji: '🥤', categoria: 'bebida' },
  { id: 'b9', nombre: 'Kolashampan', precio: 1.50, emoji: '🥤', categoria: 'bebida' },
  { id: 'b10', nombre: 'Tropical', precio: 1.50, emoji: '🥤', categoria: 'bebida' },
  { id: 'b11', nombre: 'Canada Dry', precio: 1.50, emoji: '🥤', categoria: 'bebida' },

  // Bebidas - Cervezas
  { id: 'b12', nombre: 'Pilsener', precio: 2.00, emoji: '🍺', categoria: 'bebida' },
  { id: 'b13', nombre: 'Suprema', precio: 2.00, emoji: '🍺', categoria: 'bebida' },
  { id: 'b14', nombre: 'Golden', precio: 2.00, emoji: '🍺', categoria: 'bebida' },
  { id: 'b15', nombre: 'Regia', precio: 2.00, emoji: '🍺', categoria: 'bebida' },
  { id: 'b16', nombre: 'Corona', precio: 2.50, emoji: '🍺', categoria: 'bebida' },
  { id: 'b17', nombre: 'Modelo Especial', precio: 2.50, emoji: '🍺', categoria: 'bebida' },
  { id: 'b18', nombre: 'Budweiser', precio: 2.50, emoji: '🍺', categoria: 'bebida' },
  { id: 'b19', nombre: 'Michelob Ultra', precio: 2.50, emoji: '🍺', categoria: 'bebida' },

  // Bebidas - Jugos Naturales
  { id: 'b20', nombre: 'Jugo de naranja', precio: 1.75, emoji: '🧃', categoria: 'bebida' },
  { id: 'b21', nombre: 'Jugo de piña', precio: 1.75, emoji: '🧃', categoria: 'bebida' },
  { id: 'b22', nombre: 'Jugo de mora', precio: 1.75, emoji: '🧃', categoria: 'bebida' },
  { id: 'b23', nombre: 'Jugo de tamarindo', precio: 1.75, emoji: '🧃', categoria: 'bebida' },
  { id: 'b24', nombre: 'Jugo de maracuyá', precio: 1.75, emoji: '🧃', categoria: 'bebida' },
  { id: 'b25', nombre: 'Jugo de mango', precio: 1.75, emoji: '🧃', categoria: 'bebida' },
  { id: 'b26', nombre: 'Jugo de guayaba', precio: 1.75, emoji: '🧃', categoria: 'bebida' },
  { id: 'b27', nombre: 'Jugo de fresa', precio: 1.75, emoji: '🧃', categoria: 'bebida' },
  { id: 'b28', nombre: 'Jugo de limón', precio: 1.75, emoji: '🧃', categoria: 'bebida' },

  // Bebidas - Tradicionales
  { id: 'b29', nombre: 'Horchata', precio: 1.50, emoji: '🥤', categoria: 'bebida' },
  { id: 'b30', nombre: 'Ensalada', precio: 1.50, emoji: '🍊', categoria: 'bebida' },
  { id: 'b31', nombre: 'Cebada', precio: 1.50, emoji: '🥤', categoria: 'bebida' },
  { id: 'b32', nombre: 'Tamarindo', precio: 1.50, emoji: '🍹', categoria: 'bebida' },
  { id: 'b33', nombre: 'Jamaica', precio: 1.50, emoji: '🌺', categoria: 'bebida' },
  { id: 'b34', nombre: 'Chan', precio: 1.50, emoji: '🍷', categoria: 'bebida' },
  { id: 'b35', nombre: 'Arrayán', precio: 1.50, emoji: '🌿', categoria: 'bebida' },

  // Bebidas - Licuados
  { id: 'b36', nombre: 'Licuado de banano', precio: 2.00, emoji: '🥤', categoria: 'bebida' },
  { id: 'b37', nombre: 'Licuado de fresa', precio: 2.00, emoji: '🥤', categoria: 'bebida' },
  { id: 'b38', nombre: 'Licuado de papaya', precio: 2.00, emoji: '🥤', categoria: 'bebida' },
  { id: 'b39', nombre: 'Licuado de mango', precio: 2.00, emoji: '🥤', categoria: 'bebida' },
  { id: 'b40', nombre: 'Licuado de piña', precio: 2.00, emoji: '🥤', categoria: 'bebida' },
  { id: 'b41', nombre: 'Licuado de zapote', precio: 2.00, emoji: '🥤', categoria: 'bebida' },
  { id: 'b42', nombre: 'Licuado de guineo con avena', precio: 2.25, emoji: '🥤', categoria: 'bebida' },
  { id: 'b43', nombre: 'Licuado de chocolate', precio: 2.25, emoji: '🥤', categoria: 'bebida' },

  // Bebidas - Bebidas Calientes
  { id: 'b44', nombre: 'Café negro', precio: 1.25, emoji: '☕', categoria: 'bebida' },
  { id: 'b45', nombre: 'Café con leche', precio: 1.50, emoji: '☕', categoria: 'bebida' },
  { id: 'b46', nombre: 'Chocolate caliente', precio: 1.75, emoji: '☕', categoria: 'bebida' },
  { id: 'b47', nombre: 'Atole de elote', precio: 1.75, emoji: '🥣', categoria: 'bebida' },
  { id: 'b48', nombre: 'Atole de piña', precio: 1.75, emoji: '🥣', categoria: 'bebida' },
  { id: 'b49', nombre: 'Atole de maíz tostado', precio: 1.75, emoji: '🥣', categoria: 'bebida' },

  // Bebidas - Agua
  { id: 'b50', nombre: 'Agua pura', precio: 0.75, emoji: '💧', categoria: 'bebida' },
  { id: 'b51', nombre: 'Agua embotellada', precio: 1.00, emoji: '💧', categoria: 'bebida' },
  { id: 'b52', nombre: 'Agua con gas', precio: 1.25, emoji: '💧', categoria: 'bebida' },
];

export function WaiterView() {
  const [selectedMesa, setSelectedMesa] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'pupusa' | 'bebida' | 'all'>('all');
  const [globalNotes, setGlobalNotes] = useState('');

  const filteredMenu = MENU_ITEMS.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToOrder = (item: MenuItemType) => {
    const existingItem = orderItems.find(oi => oi.pupusa.id === item.id);
    if (existingItem) {
      setOrderItems(orderItems.map(oi =>
        oi.id === existingItem.id
          ? { ...oi, cantidad: oi.cantidad + 1 }
          : oi
      ));
    } else {
      setOrderItems([...orderItems, {
        id: Date.now().toString(),
        pupusa: item,
        cantidad: 1,
        notas: '',
      }]);
    }
  };

  const getItemQuantity = (itemId: string) => {
    const item = orderItems.find(oi => oi.pupusa.id === itemId);
    return item ? item.cantidad : 0;
  };

  const updateItemQuantity = (itemId: string, delta: number) => {
    const existingItem = orderItems.find(oi => oi.pupusa.id === itemId);
    if (existingItem) {
      const newQuantity = existingItem.cantidad + delta;
      if (newQuantity <= 0) {
        setOrderItems(orderItems.filter(oi => oi.id !== existingItem.id));
      } else {
        setOrderItems(orderItems.map(oi =>
          oi.id === existingItem.id
            ? { ...oi, cantidad: newQuantity }
            : oi
        ));
      }
    } else if (delta > 0) {
      const menuItem = MENU_ITEMS.find(m => m.id === itemId);
      if (menuItem) {
        setOrderItems([...orderItems, {
          id: Date.now().toString(),
          pupusa: menuItem,
          cantidad: 1,
          notas: '',
        }]);
      }
    }
  };

  const removeFromOrder = (itemId: string) => {
    const item = orderItems.find(oi => oi.id === itemId);
    if (item && item.cantidad > 1) {
      setOrderItems(orderItems.map(oi =>
        oi.id === itemId
          ? { ...oi, cantidad: oi.cantidad - 1 }
          : oi
      ));
    } else {
      setOrderItems(orderItems.filter(oi => oi.id !== itemId));
    }
  };

  const addToOrderItem = (itemId: string) => {
    setOrderItems(orderItems.map(oi =>
      oi.id === itemId
        ? { ...oi, cantidad: oi.cantidad + 1 }
        : oi
    ));
  };

  const updateNotes = (itemId: string, notes: string) => {
    setOrderItems(orderItems.map(oi =>
      oi.id === itemId ? { ...oi, notas: notes } : oi
    ));
  };

  const sendToKitchen = () => {
    if (!selectedMesa) {
      toast.error('Selecciona una mesa primero');
      return;
    }
    if (orderItems.length === 0) {
      toast.error('Agrega items a la orden');
      return;
    }

    const total = orderItems.reduce((sum, item) => sum + (item.pupusa.precio * item.cantidad), 0);
    // Apply global notes to all items
    const itemsWithNotes = orderItems.map(item => ({
      ...item,
      notas: globalNotes || item.notas,
    }));
    const newOrder: Order = {
      id: Date.now().toString(),
      mesa: selectedMesa,
      items: itemsWithNotes,
      status: 'pendiente',
      timestamp: new Date(),
      total,
    };

    // Save to localStorage (in real app, this would be an API call)
    const existingOrders = JSON.parse(localStorage.getItem('pupuseria-orders') || '[]');
    existingOrders.push(newOrder);
    localStorage.setItem('pupuseria-orders', JSON.stringify(existingOrders));

    const totalItems = orderItems.reduce((sum, item) => sum + item.cantidad, 0);
    toast.success(`¡Pedido enviado! Mesa ${selectedMesa}`, {
      description: `${totalItems} ${totalItems === 1 ? 'pupusa' : 'pupusas'}`,
    });

    // Reset
    setOrderItems([]);
    setSelectedMesa(null);
    setGlobalNotes('');
  };

  const clearOrder = () => {
    setOrderItems([]);
  };

  const payMesa = (mesa: number) => {
    // Get all orders from localStorage
    const stored = JSON.parse(localStorage.getItem('pupuseria-orders') || '[]') as Order[];

    // Filter out all orders for this mesa (regardless of status)
    const updatedStored = stored.filter((o) => o.mesa !== mesa);
    localStorage.setItem('pupuseria-orders', JSON.stringify(updatedStored));

    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event('storage'));

    // If this mesa was selected, clear the selection
    if (selectedMesa === mesa) {
      setSelectedMesa(null);
      setOrderItems([]);
    }

    // Show toast notification
    toast.success('¡Mesa pagada!', {
      description: `Mesa ${mesa} liberada`,
    });
  };

  const total = orderItems.reduce((sum, item) => sum + (item.pupusa.precio * item.cantidad), 0);

  return (
    <div className="h-[calc(100vh-80px)] px-6 py-6 overflow-hidden flex flex-col">
      {/* 2 columns: Left (75% - MesaSelector + Menu), Right (25% - OrderSummary) */}
      <div className="grid grid-cols-4 gap-6 h-full overflow-hidden">
        {/* Left column: MesaSelector and Menu stacked (75% width) */}
        <div className="flex flex-col gap-3 col-span-3 h-full overflow-hidden">
          <MesaSelector
            selectedMesa={selectedMesa}
            onSelectMesa={setSelectedMesa}
            onPayMesa={payMesa}
          />

          <div className="flex-1 min-h-0 overflow-hidden">
            <MenuPupusas
              menuItems={filteredMenu}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onAddToOrder={addToOrder}
              getItemQuantity={getItemQuantity}
              updateItemQuantity={updateItemQuantity}
            />
          </div>
        </div>

        {/* Right column: OrderSummary (25% width, with internal scroll) */}
        <div className="flex flex-col col-span-1 h-full overflow-hidden">
          <OrderSummary
            orderItems={orderItems}
            total={total}
            selectedMesa={selectedMesa}
            onRemoveItem={removeFromOrder}
            onAddItem={addToOrderItem}
            onUpdateNotes={updateNotes}
            onSendToKitchen={sendToKitchen}
            onClearOrder={clearOrder}
            globalNotes={globalNotes}
            onGlobalNotesChange={setGlobalNotes}
          />
        </div>
      </div>
    </div>
  );
}
