import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../state/OrderContext';
import type { Pupusa, DoughType, Filling, PupusaSize } from '../../models/Pupusa';
import { Page } from '../../shared/layout/Page';
import { PAYPAL_DONATE_URL } from '../../shared/layout/Footer';
import { Button } from '../../shared/components/Button';
import { SummaryTotals } from './SummaryTotals';
import { SummaryList } from './SummaryList';
import { Card } from '../../shared/components/Card';
import { QRModal } from './QRModal';
import type { Order, OrderItem, MenuItemType } from '../../types/pupuseria';
import { toast } from 'sonner';

interface AggregatedPupusa {
  dough: DoughType;
  filling: Filling;
  withCheese: boolean;
  size: PupusaSize;
  quantity: number;
}

const getFillingDisplayName = (filling: Filling, withCheese: boolean): string => {
  const baseNames: Record<Filling, string> = {
    frijol: 'Frijol',
    revueltas: 'Revueltas',
    queso: 'Queso',
    jalapeno: 'Jalapeño',
    chicharron: 'Chicharrón',
    cochinito: 'Cochinito',
    chorizo: 'Chorizo',
    loroco: 'Loroco',
    papelillo: 'Papelillo',
    mora: 'Mora',
    mango: 'Mango',
    camaron: 'Camarón',
    pescado: 'Pescado',
    ajo: 'Ajo',
    jamon: 'Jamón',
    pepperoni: 'Pepperoni',
    hongo: 'Hongo / Champiñón',
    loca: 'Loca',
    pollo: 'Pollo',
    carne: 'Carne',
    ayote: 'Ayote',
    pina: 'Piña',
    jocote: 'Jocote',
    garrobo: 'Garrobo',
    cusuco: 'Cusuco',
    conejo: 'Conejo',
  };
  
  const baseName = baseNames[filling] || filling;
  
  if (withCheese && filling !== 'queso' && filling !== 'revueltas' && filling !== 'loca') {
    return `${baseName} con queso`;
  }
  
  return baseName;
};

const getDoughDisplayName = (dough: DoughType): string => {
  return dough === 'maiz' ? 'Maíz' : 'Arroz';
};

const getSizeDisplayName = (size: PupusaSize): string => {
  const sizeNames: Record<PupusaSize, string> = {
    pequena: 'Pequeña',
    normal: 'Normal',
    grande: 'Grande',
  };
  return sizeNames[size];
};

export function KitchenSummary() {
  const { order } = useOrder();
  const navigate = useNavigate();

  if (!order) {
    navigate('/');
    return null;
  }

  // Aggregate pupusas by dough + filling + withCheese + size
  const aggregatedPupusas = useMemo(() => {
    const allPupusas: Pupusa[] = order.people.flatMap(person => person.pupusas);

    const aggregated = new Map<string, AggregatedPupusa>();

    allPupusas.forEach(pupusa => {
      const key = `${pupusa.dough}-${pupusa.filling}-${pupusa.withCheese}-${pupusa.size}`;
      const existing = aggregated.get(key);

      if (existing) {
        existing.quantity += pupusa.quantity;
      } else {
        aggregated.set(key, {
          dough: pupusa.dough,
          filling: pupusa.filling,
          withCheese: pupusa.withCheese,
          size: pupusa.size,
          quantity: pupusa.quantity,
        });
      }
    });

    return Array.from(aggregated.values()).sort((a, b) => {
      // Sort by dough type first (maiz before arroz), then by filling
      if (a.dough !== b.dough) {
        return a.dough === 'maiz' ? -1 : 1;
      }
      return a.filling.localeCompare(b.filling);
    });
  }, [order]);

  // Aggregate beverages by name (flat list, no categories)
  const aggregatedBeverages = useMemo(() => {
    const byName = new Map<string, number>();
    order.people.forEach(person => {
      person.beverages.forEach(b => {
        byName.set(b.name, (byName.get(b.name) ?? 0) + b.quantity);
      });
    });
    return Array.from(byName.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [order]);

  // Subtotal en USD (pupusas + bebidas)
  const subtotal = useMemo(() => {
    return order.people.reduce(
      (sum, person) =>
        sum +
        person.pupusas.reduce((s, p) => s + p.quantity * p.priceUSD, 0) +
        person.beverages.reduce((s, b) => s + b.quantity * b.priceUSD, 0),
      0
    );
  }, [order]);

  const [tipPercent, setTipPercent] = useState(0);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState('');
  const tipAmount = subtotal * (tipPercent / 100);
  const totalWithTip = subtotal + tipAmount;

  // Por persona: subtotal y total con propina (propina proporcional a su pedido)
  const personTotals = useMemo(() => {
    return order.people.map((person) => {
      const personSubtotal =
        person.pupusas.reduce((s, p) => s + p.quantity * p.priceUSD, 0) +
        person.beverages.reduce((s, b) => s + b.quantity * b.priceUSD, 0);
      const personTip = subtotal > 0 ? tipAmount * (personSubtotal / subtotal) : 0;
      const personTotal = personSubtotal + personTip;
      return { personSubtotal, personTip, personTotal };
    });
  }, [order, subtotal, tipAmount]);

  const handleBack = () => {
    navigate('/order');
  };

  // Generate QR data (same format as WhatsApp message)
  const generateQRData = (): string => {
    let message = `*${order.groupName}*\n`;
    message += `👨‍🍳 *Resumen para Cocina*\n\n`;
    
    message += `*Detalle del Pedido:*\n`;
    if (aggregatedPupusas.length === 0 && aggregatedBeverages.length === 0) {
      message += `No hay ítems en el pedido\n`;
    } else {
      aggregatedPupusas.forEach((item) => {
        const emojiMap: Record<Filling, string> = {
          frijol: '🫘',
          revueltas: '🥓',
          queso: '🧀',
          jalapeno: '🌶️',
          chicharron: '🐷',
          cochinito: '🍃',
          chorizo: '🌭',
          loroco: '🌸',
          papelillo: '🍃',
          mora: '🌿',
          mango: '🥭',
          camaron: '🦐',
          pescado: '🐟',
          ajo: '🧄',
          jamon: '🍖',
          pepperoni: '🍕',
          hongo: '🍄',
          loca: '🎲',
          pollo: '🐔',
          carne: '🥩',
          ayote: '🎃',
          pina: '🍍',
          jocote: '🍑',
          garrobo: '🦎',
          cusuco: '🦔',
          conejo: '🐰',
        };
        const emoji = emojiMap[item.filling] || '🫓';
        const doughName = getDoughDisplayName(item.dough);
        const fillingName = getFillingDisplayName(item.filling, item.withCheese);
        const sizeName = getSizeDisplayName(item.size);
        message += `${emoji} ${item.quantity} de ${fillingName} de ${doughName} (${sizeName})\n`;
      });
      aggregatedBeverages.forEach((item) => {
        message += `🥤 ${item.quantity} ${item.name}\n`;
      });
    }
    message += `\n`;
    message += `*Subtotal:* $${subtotal.toFixed(2)}\n`;
    if (tipPercent > 0) {
      message += `*Propina (${tipPercent}%):* $${tipAmount.toFixed(2)}\n`;
      message += `*Total:* $${totalWithTip.toFixed(2)}\n`;
    } else {
      message += `*Total:* $${subtotal.toFixed(2)}\n`;
    }
    return message;
  };

  // Convert GroupOrder to pupusería Order format
  const convertToPupuseriaOrder = (): Order => {
    const items: OrderItem[] = [];

    // Full menu items from pupusería system
    const menuItems: MenuItemType[] = [
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
      
      // Bebidas - Sodas (11 items)
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
      
      // Bebidas - Cervezas (8 items)
      { id: 'b12', nombre: 'Pilsener', precio: 2.00, emoji: '🍺', categoria: 'bebida' },
      { id: 'b13', nombre: 'Suprema', precio: 2.00, emoji: '🍺', categoria: 'bebida' },
      { id: 'b14', nombre: 'Golden', precio: 2.00, emoji: '🍺', categoria: 'bebida' },
      { id: 'b15', nombre: 'Regia', precio: 2.00, emoji: '🍺', categoria: 'bebida' },
      { id: 'b16', nombre: 'Corona', precio: 2.50, emoji: '🍺', categoria: 'bebida' },
      { id: 'b17', nombre: 'Modelo Especial', precio: 2.50, emoji: '🍺', categoria: 'bebida' },
      { id: 'b18', nombre: 'Budweiser', precio: 2.00, emoji: '🍺', categoria: 'bebida' },
      { id: 'b19', nombre: 'Michelob Ultra', precio: 2.50, emoji: '🍺', categoria: 'bebida' },

      // Bebidas - Jugos naturales (9 items)
      { id: 'b20', nombre: 'Jugo de naranja', precio: 1.75, emoji: '🍊', categoria: 'bebida' },
      { id: 'b21', nombre: 'Jugo de piña', precio: 1.75, emoji: '🍍', categoria: 'bebida' },
      { id: 'b22', nombre: 'Jugo de mora', precio: 1.75, emoji: '🫐', categoria: 'bebida' },
      { id: 'b23', nombre: 'Jugo de tamarindo', precio: 1.75, emoji: '🍹', categoria: 'bebida' },
      { id: 'b24', nombre: 'Jugo de maracuyá', precio: 1.75, emoji: '🍹', categoria: 'bebida' },
      { id: 'b25', nombre: 'Jugo de mango', precio: 1.75, emoji: '🥭', categoria: 'bebida' },
      { id: 'b26', nombre: 'Jugo de guayaba', precio: 1.75, emoji: '🍈', categoria: 'bebida' },
      { id: 'b27', nombre: 'Jugo de fresa', precio: 1.75, emoji: '🍓', categoria: 'bebida' },
      { id: 'b28', nombre: 'Jugo de limón', precio: 1.50, emoji: '🍋', categoria: 'bebida' },

      // Bebidas - Tradicionales (7 items)
      { id: 'b29', nombre: 'Horchata', precio: 1.50, emoji: '🥛', categoria: 'bebida' },
      { id: 'b30', nombre: 'Ensalada', precio: 1.50, emoji: '🥗', categoria: 'bebida' },
      { id: 'b31', nombre: 'Cebada', precio: 1.25, emoji: '🌾', categoria: 'bebida' },
      { id: 'b32', nombre: 'Tamarindo', precio: 1.25, emoji: '🍹', categoria: 'bebida' },
      { id: 'b33', nombre: 'Jamaica', precio: 1.25, emoji: '🌺', categoria: 'bebida' },
      { id: 'b34', nombre: 'Chan', precio: 1.25, emoji: '🍷', categoria: 'bebida' },
      { id: 'b35', nombre: 'Arrayán', precio: 1.50, emoji: '🌳', categoria: 'bebida' },

      // Bebidas - Licuados (8 items)
      { id: 'b36', nombre: 'Licuado de banano', precio: 2.00, emoji: '🍌', categoria: 'bebida' },
      { id: 'b37', nombre: 'Licuado de fresa', precio: 2.00, emoji: '🍓', categoria: 'bebida' },
      { id: 'b38', nombre: 'Licuado de papaya', precio: 2.00, emoji: '🥭', categoria: 'bebida' },
      { id: 'b39', nombre: 'Licuado de mango', precio: 2.00, emoji: '🥭', categoria: 'bebida' },
      { id: 'b40', nombre: 'Licuado de piña', precio: 2.00, emoji: '🍍', categoria: 'bebida' },
      { id: 'b41', nombre: 'Licuado de zapote', precio: 2.00, emoji: '🥑', categoria: 'bebida' },
      { id: 'b42', nombre: 'Licuado de guineo con avena', precio: 2.00, emoji: '🍌', categoria: 'bebida' },
      { id: 'b43', nombre: 'Licuado de chocolate', precio: 2.00, emoji: '🍫', categoria: 'bebida' },

      // Bebidas - Bebidas calientes (6 items)
      { id: 'b44', nombre: 'Café negro', precio: 1.00, emoji: '☕', categoria: 'bebida' },
      { id: 'b45', nombre: 'Café con leche', precio: 1.25, emoji: '🥛', categoria: 'bebida' },
      { id: 'b46', nombre: 'Chocolate caliente', precio: 1.50, emoji: '🍫', categoria: 'bebida' },
      { id: 'b47', nombre: 'Atole de elote', precio: 1.50, emoji: '🌽', categoria: 'bebida' },
      { id: 'b48', nombre: 'Atole de piña', precio: 1.50, emoji: '🍍', categoria: 'bebida' },
      { id: 'b49', nombre: 'Atole de maíz tostado', precio: 1.50, emoji: '🌽', categoria: 'bebida' },

      // Bebidas - Agua (3 items)
      { id: 'b50', nombre: 'Agua pura', precio: 0.75, emoji: '💧', categoria: 'bebida' },
      { id: 'b51', nombre: 'Agua embotellada', precio: 1.00, emoji: '💧', categoria: 'bebida' },
      { id: 'b52', nombre: 'Agua con gas', precio: 1.25, emoji: '🍾', categoria: 'bebida' },
    ];

    // Helper to find menu item by name (handles "con queso" variants)
    const findMenuItem = (name: string, categoria: 'pupusa' | 'bebida'): MenuItemType | null => {
      // For pupusas, remove "con queso" suffix and match base name
      if (categoria === 'pupusa') {
        const baseName = name.replace(/\s+con queso$/i, '').trim();
        return menuItems.find(item => item.nombre === baseName && item.categoria === categoria) || null;
      }
      // For beverages, match exact name
      return menuItems.find(item => item.nombre === name && item.categoria === categoria) || null;
    };

    // Convert pupusas
    order.people.forEach(person => {
      person.pupusas.forEach(pupusa => {
        const fillingName = getFillingDisplayName(pupusa.filling, pupusa.withCheese);
        const menuItem = findMenuItem(fillingName, 'pupusa');
        if (menuItem) {
          items.push({
            id: `${pupusa.id}-${Date.now()}`,
            pupusa: menuItem,
            cantidad: pupusa.quantity,
            notas: `${getDoughDisplayName(pupusa.dough)} - ${getSizeDisplayName(pupusa.size)}`,
          });
        }
      });
    });

    // Convert beverages
    order.people.forEach(person => {
      person.beverages.forEach(beverage => {
        const menuItem = findMenuItem(beverage.name, 'bebida');
        if (menuItem) {
          items.push({
            id: `${beverage.id}-${Date.now()}`,
            pupusa: menuItem,
            cantidad: beverage.quantity,
            notas: '',
          });
        }
      });
    });

    // Aggregate items by menu item
    const aggregated = new Map<string, OrderItem>();
    items.forEach(item => {
      const key = item.pupusa.id;
      const existing = aggregated.get(key);
      if (existing) {
        existing.cantidad += item.cantidad;
        if (item.notas && !existing.notas.includes(item.notas)) {
          existing.notas = existing.notas ? `${existing.notas}, ${item.notas}` : item.notas;
        }
      } else {
        aggregated.set(key, { ...item });
      }
    });

    const total = Array.from(aggregated.values()).reduce(
      (sum, item) => sum + (item.pupusa.precio * item.cantidad),
      0
    );

    return {
      id: `group-${order.groupName}-${Date.now()}`,
      mesa: 0, // Mesa 0 = pedido del sistema principal
      items: Array.from(aggregated.values()),
      status: 'pendiente',
      timestamp: new Date(),
      total,
    };
  };

  const handleGenerateQR = () => {
    const data = generateQRData();
    setQrData(data);
    setShowQRModal(true);
  };

  const handleSendToKitchen = () => {
    try {
      const pupuseriaOrder = convertToPupuseriaOrder();
      
      if (pupuseriaOrder.items.length === 0) {
        toast.error('No hay items en el pedido para enviar');
        return;
      }

      // Save to localStorage (same as WaiterView)
      const existingOrders: Order[] = JSON.parse(localStorage.getItem('pupuseria-orders') || '[]');
      existingOrders.push(pupuseriaOrder);
      localStorage.setItem('pupuseria-orders', JSON.stringify(existingOrders));
      window.dispatchEvent(new Event('storage')); // Notify other components

      toast.success('¡Pedido enviado a cocina!', {
        description: `${pupuseriaOrder.items.length} ${pupuseriaOrder.items.length === 1 ? 'item' : 'items'} - ${order.groupName}`,
      });
    } catch (error) {
      toast.error('Error al enviar el pedido a cocina');
      console.error(error);
    }
  };

  const handleSendToWhatsApp = () => {
    // Build WhatsApp message with complete summary (Salvadoran format)
    let message = `*${order.groupName}*\n`;
    message += `👨‍🍳 *Resumen para Cocina*\n\n`;
    
    // Aggregated List (Kitchen-friendly) - Salvadoran format
    message += `*Detalle del Pedido:*\n`;
    if (aggregatedPupusas.length === 0 && aggregatedBeverages.length === 0) {
      message += `No hay ítems en el pedido\n`;
    } else {
      aggregatedPupusas.forEach((item) => {
        const emojiMap: Record<Filling, string> = {
          frijol: '🫘',
          revueltas: '🥓',
          queso: '🧀',
          jalapeno: '🌶️',
          chicharron: '🐷',
          cochinito: '🍃',
          chorizo: '🌭',
          loroco: '🌸',
          papelillo: '🍃',
          mora: '🌿',
          mango: '🥭',
          camaron: '🦐',
          pescado: '🐟',
          ajo: '🧄',
          jamon: '🍖',
          pepperoni: '🍕',
          hongo: '🍄',
          loca: '🎲',
          pollo: '🐔',
          carne: '🥩',
          ayote: '🎃',
          pina: '🍍',
          jocote: '🍑',
          garrobo: '🦎',
          cusuco: '🦔',
          conejo: '🐰',
        };
        const emoji = emojiMap[item.filling] || '🫓';
        const doughName = getDoughDisplayName(item.dough);
        const fillingName = getFillingDisplayName(item.filling, item.withCheese);
        const sizeName = getSizeDisplayName(item.size);
        message += `${emoji} ${item.quantity} de ${fillingName} de ${doughName} (${sizeName})\n`;
      });
      aggregatedBeverages.forEach((item) => {
        message += `🥤 ${item.quantity} ${item.name}\n`;
      });
    }
    message += `\n`;

    // Totales y propina
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `*Subtotal:* $${subtotal.toFixed(2)}\n`;
    if (tipPercent > 0) {
      message += `*Propina (${tipPercent}%):* $${tipAmount.toFixed(2)}\n`;
      message += `*Total:* $${totalWithTip.toFixed(2)}\n`;
    } else {
      message += `*Total:* $${subtotal.toFixed(2)}\n`;
    }
    message += `\n`;

    // Per-Person Breakdown con precios
    message += `*Resumen por Persona:*\n\n`;
    order.people.forEach((person, index) => {
      const { personSubtotal, personTip, personTotal } = personTotals[index];
      const personItemCount =
        person.pupusas.reduce((s, p) => s + p.quantity, 0) +
        person.beverages.reduce((s, b) => s + b.quantity, 0);
      if (personItemCount === 0) return;

      message += `*${person.name}:*\n`;
      person.pupusas.forEach((pupusa) => {
        const doughName = getDoughDisplayName(pupusa.dough).toLowerCase();
        const fillingName = getFillingDisplayName(pupusa.filling, pupusa.withCheese);
        const sizeName = getSizeDisplayName(pupusa.size);
        const lineTotal = pupusa.quantity * pupusa.priceUSD;
        message += `  • ${pupusa.quantity} de ${doughName} de ${fillingName} (${sizeName}) — $${lineTotal.toFixed(2)}\n`;
      });
      person.beverages.forEach((b) => {
        const lineTotal = b.quantity * b.priceUSD;
        message += `  • ${b.quantity} ${b.name} — $${lineTotal.toFixed(2)}\n`;
      });
      message += `  Subtotal: $${personSubtotal.toFixed(2)}\n`;
      if (tipPercent > 0) {
        message += `  Propina: $${personTip.toFixed(2)}\n`;
        message += `  *Total: $${personTotal.toFixed(2)}*\n`;
      } else {
        message += `  *Total: $${personSubtotal.toFixed(2)}*\n`;
      }
      message += `\n`;
    });

    // Prefer Web Share API on mobile: user stays in the app, no blank screen on return
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: order.groupName,
          text: message,
        })
        .catch(() => {
          // User cancelled or share failed: fallback to WhatsApp URL
          const encodedMessage = encodeURIComponent(message);
          window.open(`https://wa.me/?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
        });
      return;
    }

    // Fallback: open WhatsApp in new tab (desktop or old browsers)
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Page>
      <div className="min-h-screen bg-app">
        {/* Green Header */}
        <div className="bg-action-green px-5 py-4">
          <div className="max-w-xl mx-auto flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="text-white hover:bg-action-green-hover/80 transition-colors flex items-center gap-2 rounded-lg py-1 px-2 -ml-2"
            >
              <span>←</span>
              <span className="text-sm">Volver al pedido</span>
            </button>
          </div>
          <div className="max-w-xl mx-auto mt-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-action-green-hover flex items-center justify-center">
              <span className="text-2xl">👨‍🍳</span>
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold">Resumen para Cocina</h1>
              <p className="text-sm text-white/90">{order.groupName}</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 space-y-5">
          <SummaryTotals
            subtotal={subtotal}
            tipPercent={tipPercent}
            onTipPercentChange={setTipPercent}
            tipAmount={tipAmount}
            totalWithTip={totalWithTip}
          />

          <SummaryList
            aggregatedPupusas={aggregatedPupusas}
            aggregatedBeverages={aggregatedBeverages}
          />

          {/* Summary by Person con precios */}
          <Card>
            <h2 className="text-lg font-bold text-primary mb-4">Resumen por Persona</h2>
            <div className="space-y-4">
              {order.people.map((person, index) => {
                const personItemCount =
                  person.pupusas.reduce((s, p) => s + p.quantity, 0) +
                  person.beverages.reduce((s, b) => s + b.quantity, 0);
                if (personItemCount === 0) return null;

                const { personSubtotal, personTip, personTotal } = personTotals[index];

                return (
                  <div key={person.id} className="border-b border-neutral-border last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-primary">{person.name}</span>
                      <span className="text-secondary font-medium text-sm">
                        Subtotal: ${personSubtotal.toFixed(2)}
                        {tipPercent > 0 && (
                          <> · Con propina: <span className="font-bold text-action-green">${personTotal.toFixed(2)}</span></>
                        )}
                      </span>
                    </div>
                    <div className="space-y-1 ml-2">
                      {person.pupusas.map((pupusa) => (
                        <div key={pupusa.id} className="text-sm text-secondary flex justify-between gap-2">
                          <span>• {pupusa.quantity}x {getDoughDisplayName(pupusa.dough)} - {getFillingDisplayName(pupusa.filling, pupusa.withCheese)} ({getSizeDisplayName(pupusa.size)})</span>
                          <span className="shrink-0">${(pupusa.quantity * pupusa.priceUSD).toFixed(2)}</span>
                        </div>
                      ))}
                      {person.beverages.map((beverage) => (
                        <div key={beverage.id} className="text-sm text-secondary flex justify-between gap-2">
                          <span>• {beverage.quantity}x {beverage.name}</span>
                          <span className="shrink-0">${(beverage.quantity * beverage.priceUSD).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {tipPercent > 0 && (
                      <div className="ml-2 mt-1 text-xs text-secondary">
                        Propina ({tipPercent}%): ${personTip.toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <Button
              type="button"
              variant="success"
              onClick={handleSendToWhatsApp}
              className="w-full px-4 py-3 flex items-center justify-center gap-2"
            >
              <span>📱</span>
              <span>Enviar a WhatsApp</span>
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="primary"
                onClick={handleGenerateQR}
                className="w-full px-4 py-3 flex items-center justify-center gap-2"
              >
                <span>📱</span>
                <span>Generar QR</span>
              </Button>
              
              <Button
                type="button"
                variant="success"
                onClick={handleSendToKitchen}
                className="w-full px-4 py-3 flex items-center justify-center gap-2"
              >
                <span>👨‍🍳</span>
                <span>Enviar a Cocina</span>
              </Button>
            </div>
          </div>

          {/* QR Modal */}
          <QRModal
            isOpen={showQRModal}
            onClose={() => setShowQRModal(false)}
            qrData={qrData}
            title="Código QR del Pedido"
          />

          {/* Support section - después del resumen, opcional y discreto */}
          <div className="pt-8 pb-2 text-center">
            <p className="text-secondary text-sm mb-3">
              Si Pupas te ayudó a ordenar sin relajo, podés apoyar el proyecto aquí ☕
            </p>
            <a
              href={PAYPAL_DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] py-2.5 px-4 rounded-lg border border-neutral-border text-secondary hover:text-brand-orange hover:border-brand-orange/50 hover:bg-brand-focus-ring/10 text-sm font-medium transition-colors"
              aria-label="Apoyar el proyecto con PayPal"
            >
              <span className="text-base" aria-hidden>☕</span>
              <span>Apoyar con PayPal</span>
            </a>
          </div>
        </div>
      </div>
    </Page>
  );
}
