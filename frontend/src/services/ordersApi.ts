/**
 * API client for orders endpoints
 */

import type { Order, OrderItem } from '../types/pupuseria';
import type { BackendOrderResponse } from './api.types';
import { transformToBackendOrderCreate, transformToFrontendOrder } from './orderTransform';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE = `${API_URL}/api/v1`;

/**
 * API Error class for better error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

/**
 * Create a new order
 */
export async function createOrder(
  tableNumber: number,
  items: OrderItem[]
): Promise<Order> {
  const backendOrder = transformToBackendOrderCreate(tableNumber, items);
  const response = await apiFetch<BackendOrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(backendOrder),
  });
  return transformToFrontendOrder(response);
}

/**
 * Get all pending orders
 */
export async function getPendingOrders(): Promise<Order[]> {
  const response = await apiFetch<BackendOrderResponse[]>('/orders/pending');
  return response.map(transformToFrontendOrder);
}

/**
 * Delete (cancel) an order
 */
export async function deleteOrder(orderId: string): Promise<Order> {
  const response = await apiFetch<BackendOrderResponse>(`/orders/${orderId}`, {
    method: 'DELETE',
  });
  return transformToFrontendOrder(response);
}

/**
 * Complete an order
 */
export async function completeOrder(orderId: string): Promise<Order> {
  const response = await apiFetch<BackendOrderResponse>(
    `/orders/${orderId}/complete`,
    {
      method: 'PATCH',
    }
  );
  return transformToFrontendOrder(response);
}

/**
 * Export all API methods as a single object for easier imports
 */
export const ordersApi = {
  createOrder,
  getPendingOrders,
  deleteOrder,
  completeOrder,
};
