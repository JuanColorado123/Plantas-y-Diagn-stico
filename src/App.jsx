import { CartProvider } from './contexts/CartContext'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' // Nombre correcto
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Diagnosis from './pages/Diagnosis'
import CartPage from './pages/CartPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
  {
    path: "/diagnosis",
    element: <Diagnosis />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
])

function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
      
      {/* Cambiar ToastContainer por Toaster */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </CartProvider>
  )
}

export default App