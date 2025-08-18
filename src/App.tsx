import './App.css'
import { Avatar, Box, Button, Card } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
 import { PublicRoutes } from './routes/Router.tsx'

function App() {

  const router = createBrowserRouter([
    ...PublicRoutes,
    {
      path: "*",
      element: (
        <Navigate
          to={"/egressos/"}
          replace
        />
      ),
    },
  ]);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15000,
      },
    },
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  )
}

export default App
