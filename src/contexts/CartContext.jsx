// contexts/CartContext.jsx
import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState([])

    const addToCart = (product) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item.id === product.id)
            if (existingItem) {
                toast.success(`Cantidad de ${product.name} actualizada`)
                return currentCart.map(item => 
                    item.id === product.id 
                    ? {...item, quantity: item.quantity + 1} 
                    : item
                )
            }
            toast.success(`${product.name} añadido al carrito`)
            return [...currentCart, {...product, quantity: 1}]
        })
    }

    const removeFromCart = (productId) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item.id === productId)
            
            if (existingItem.quantity > 1) {
                return currentCart.map(item => 
                    item.id === productId 
                    ? {...item, quantity: item.quantity - 1} 
                    : item
                )
            }
            
            toast.error('Producto eliminado')
            return currentCart.filter(item => item.id !== productId)
        })
    }

    const clearCart = () => {
        setCart([])
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)