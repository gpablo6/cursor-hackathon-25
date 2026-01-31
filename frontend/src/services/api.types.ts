/**
 * Backend API types - matching the FastAPI backend schemas
 */

export interface BackendOrderItem {
  name: string;
  amount: number;
  price: number;
}

export interface BackendOrderCreate {
  table_number: number;
  items: BackendOrderItem[];
}

export interface BackendOrderItemResponse {
  id: number;
  name: string;
  amount: number;
  price: number;
}

export type BackendOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface BackendOrderResponse {
  id: number;
  table_number: number;
  status: BackendOrderStatus;
  items: BackendOrderItemResponse[];
  total: number;
  created_at: string;
}
