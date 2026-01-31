import { RouterProvider } from 'react-router-dom';
import { OrderProvider } from '../state/OrderContext';
import { router } from './routes';

export function App() {
  return (
    <OrderProvider>
      <RouterProvider router={router} />
    </OrderProvider>
  );
}