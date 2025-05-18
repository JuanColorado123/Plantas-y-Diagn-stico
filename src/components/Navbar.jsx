// components/Navbar.jsx
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow-lg px-4 sm:px-8">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">PlantShop</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/">Tienda</Link></li>
                    <li><Link to="/diagnosis">Diagnóstico</Link></li>
                    <li><Link to="/cart">Carrito</Link></li>
                </ul>
            </div>
        </div>
    )
}