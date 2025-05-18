import { CartProvider } from './contexts/CartContext'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Diagnosis from './pages/Diagnosis'
import CartPage from './pages/CartPage'

// Crea el router fuera del componente App
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
    </CartProvider>
  )
}

export default App