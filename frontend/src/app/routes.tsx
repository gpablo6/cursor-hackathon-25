import { createBrowserRouter } from 'react-router-dom'
import { GroupForm } from '../features/group/GroupForm'
import { PersonList } from '../features/person/PersonList'
import { KitchenSummary } from '../features/summary/KitchenSummary'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <GroupForm />,
    },
    {
      path: '/order',
      element: <PersonList />,
    },
    {
      path: '/summary',
      element: <KitchenSummary />,
    },
  ],
  {
    basename: '/pupas/',
  }
)
