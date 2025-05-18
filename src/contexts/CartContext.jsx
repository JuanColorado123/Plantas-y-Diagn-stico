// contexts/CartContext.jsx
import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState([])

    const addToCart = (product) => {
        setCart([...cart, { ...product, quantity: 1 }])
    }

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId))
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)