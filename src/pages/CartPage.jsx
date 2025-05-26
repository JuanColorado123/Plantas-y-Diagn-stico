// pages/CartPage.jsx
import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

export default function CartPage() {
    const { cart, removeFromCart, clearCart } = useCart()
    const [purchaseCompleted, setPurchaseCompleted] = useState(false)
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const handleCheckout = () => {
        clearCart()
        setPurchaseCompleted(true)
        toast.success('¡Compra realizada con éxito!')
    }

    if (purchaseCompleted) {
        return (
            <div>
                <Navbar />
                <div className="container mx-auto p-4 text-center">
                    <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
                    <p className="text-xl mb-4">Tu pedido está siendo procesado.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setPurchaseCompleted(false)}
                    >
                        Volver a la tienda
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>

                {cart.length === 0 ? (
                    <div className="text-center text-gray-500 text-xl">
                        Tu carrito está vacío
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="card bg-base-100 shadow-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                                            <div>
                                                <h2 className="text-xl font-bold">{item.name}</h2>
                                                <p>${item.price} x {item.quantity}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="btn btn-error btn-sm"
                                        >
                                            {item.quantity > 1 ? 'Reducir' : 'Eliminar'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 text-right">
                            <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
                            <button
                                className="btn btn-primary mt-4"
                                onClick={handleCheckout}
                            >
                                Proceder al Pago
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}