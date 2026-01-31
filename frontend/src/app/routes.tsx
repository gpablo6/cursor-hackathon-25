import { createBrowserRouter, useRouteError, Link } from 'react-router-dom'
import { GroupForm } from '../features/group/GroupForm'
import { PersonList } from '../features/person/PersonList'
import { KitchenSummary } from '../features/summary/KitchenSummary'
import { Pupuseria } from '../pages/Pupuseria'

function ErrorPage() {
  let error: any;
  try {
    error = useRouteError();
  } catch (e) {
    error = { status: 404, statusText: 'Not Found', message: 'Página no encontrada' };
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pupuseria-crema font-dm-sans">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-pupuseria-chicharron mb-4">
          {error?.status || '404'}
        </h1>
        <p className="text-xl text-pupuseria-chicharron mb-2">
          {error?.statusText || 'Página no encontrada'}
        </p>
        {error?.message && (
          <p className="text-sm text-gray-600 mb-6">{error.message}</p>
        )}
        <div className="flex gap-4 justify-center">
          <Link
            to="/pupas"
            className="btn-3d-primary px-6 py-3"
          >
            Volver al inicio
          </Link>
          <Link
            to="/pupuseria"
            className="btn-3d-primary px-6 py-3"
          >
            Ir a Pupusería
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Ruta correcta: <code className="bg-gray-100 px-2 py-1 rounded">/pupuseria</code>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          URL actual: <code className="bg-gray-100 px-2 py-1 rounded">{window.location.pathname}</code>
        </p>
      </div>
    </div>
  )
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <GroupForm />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/pupas',
      element: <GroupForm />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/order',
      element: <PersonList />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/summary',
      element: <KitchenSummary />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/pupuseria',
      element: <Pupuseria />,
      errorElement: <ErrorPage />,
    },
    {
      path: '*',
      element: <ErrorPage />,
    },
  ]
)
