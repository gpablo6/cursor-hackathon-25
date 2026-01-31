export type MenuItemType = {
  id: string;
  nombre: string;
  precio: number;
  emoji: string;
  categoria: 'pupusa' | 'bebida';
};

export type OrderItem = {
  id: string;
  pupusa: MenuItemType;
  cantidad: number;
  notas: string;
};

export type OrderStatus = 'pendiente' | 'preparando' | 'listo';

export type Order = {
  id: string;
  mesa: number;
  items: OrderItem[];
  status: OrderStatus;
  timestamp: Date;
  total: number;
};

export const MESAS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
