/**
 * Data transformation utilities for converting between frontend and backend order formats
 */

import type { Order, OrderItem, OrderStatus } from '../types/pupuseria';
import type {
  BackendOrderCreate,
  BackendOrderResponse,
  BackendOrderStatus,
} from './api.types';

/**
 * Convert frontend order status to backend status
 */
export function toBackendStatus(status: OrderStatus): BackendOrderStatus {
  const statusMap: Record<OrderStatus, BackendOrderStatus> = {
    pendiente: 'pending',
    preparando: 'in_progress',
    listo: 'completed',
  };
  return statusMap[status];
}

/**
 * Convert backend order status to frontend status
 */
export function toFrontendStatus(status: BackendOrderStatus): OrderStatus {
  const statusMap: Record<BackendOrderStatus, OrderStatus> = {
    pending: 'pendiente',
    in_progress: 'preparando',
    completed: 'listo',
    cancelled: 'pendiente', // Treat cancelled as pending for display purposes
  };
  return statusMap[status];
}

/**
 * Transform frontend order items to backend format for order creation
 */
export function transformToBackendOrderCreate(
  tableNumber: number,
  items: OrderItem[]
): BackendOrderCreate {
  return {
    table_number: tableNumber,
    items: items.map((item) => ({
      name: item.pupusa.nombre,
      amount: item.cantidad,
      price: item.pupusa.precio,
    })),
  };
}

/**
 * Transform backend order response to frontend order format
 */
export function transformToFrontendOrder(
  backendOrder: BackendOrderResponse
): Order {
  return {
    id: backendOrder.id.toString(),
    mesa: backendOrder.table_number,
    status: toFrontendStatus(backendOrder.status),
    items: backendOrder.items.map((item) => ({
      id: item.id.toString(),
      pupusa: {
        id: item.id.toString(),
        nombre: item.name,
        precio: item.price,
        emoji: '🫓', // Default emoji for items from backend
        categoria: 'pupusa' as const,
      },
      cantidad: item.amount,
      notas: '', // Backend doesn't store notes yet
    })),
    timestamp: new Date(backendOrder.created_at),
    total: backendOrder.total,
  };
}
