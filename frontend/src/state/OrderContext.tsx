import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { GroupOrder } from '../models/GroupOrder';
import type { OrderAction } from './orderReducer';
import { orderReducer } from './orderReducer';

const STORAGE_KEY = 'pupas-order';

/** Persistimos en localStorage para que el pedido sobreviva al cerrar tab o navegador. */
function loadOrderFromStorage(): GroupOrder | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw.trim() === '') return null;
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== 'object' || !('groupName' in data) || !Array.isArray((data as GroupOrder).people)) {
      return null;
    }
    return data as GroupOrder;
  } catch {
    return null;
  }
}

/** Guardado en tiempo real en localStorage (cierre de tab/navegador no pierde el pedido). */
/** Al resetear (empezar de nuevo) se limpia local y session para ese pedido. */
function saveOrderToStorage(order: GroupOrder | null): void {
  try {
    if (order && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    } else {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

interface OrderContextType {
  order: GroupOrder | null;
  dispatch: React.Dispatch<OrderAction>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export function OrderProvider({ children }: OrderProviderProps) {
  const [order, dispatch] = useReducer(orderReducer, null, () => loadOrderFromStorage());

  useEffect(() => {
    saveOrderToStorage(order);
  }, [order]);

  return (
    <OrderContext.Provider value={{ order, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}