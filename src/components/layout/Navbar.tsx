import { navItems } from "@/config/navItems";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

import logoLandscape from "../../assets/logo_landscape.png";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const role = user?.role ?? "guest"; // si no está logueado → guest
    const items = navItems[role];

    return (
        <nav className="flex gap-4 p-4 bg-white justify-between items-center shadow-md ">
            <div className="flex">
                <img src={logoLandscape} alt="logo" className="h-11" />
            </div>

            <div className="flex gap-4">
                {items.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className="text-gray-700 hover:text-red-600"
                    >
                        {item.label}
                    </a>
                ))}
            </div>

            <div>
                {isAuthenticated ? (
                    <button
                        onClick={() => dispatch(logout())}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Cerrar sesión
                    </button>
                ) : (
                    <a
                        href="/login"
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Iniciar sesión
                    </a>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
