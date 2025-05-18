// components/Cart.jsx
import Navbar from './Navbar'
import { useCart } from '../contexts/CartContext'

export default function Cart() {
    const { cart, removeFromCart } = useCart()
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>

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
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-right">
                    <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
                    <button className="btn btn-primary mt-4">Proceder al Pago</button>
                </div>
            </div>
        </div>
    )
}