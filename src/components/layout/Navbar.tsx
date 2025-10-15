import { GraduationCap, Users, BriefcaseBusiness, UserCog, User } from "lucide-react";

import { navItems } from "@/config/navItems";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { toggleSidebar } from "@/store/slices/uiSlice";

import logoLandscape from "@/assets/logo_landscape.png";
import logoUfps from "@/assets/Logo-nuevo-vertical.png";
import escudoColombia from "@/assets/Escudo_presidencial_republica_de_Colombia.png";
import bannerBackground from "@/assets/banner.png";
import { useLocation, useNavigate } from "react-router";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const role = user?.role ?? "guest"; // si no está logueado → guest
    const items = navItems[role];

    const handleNavClick = (href: string) => {
        if (href.startsWith("#")) {
            const basePath = location.pathname.startsWith("/dashboard") ? "/dashboard" : "/";

            if (location.pathname === basePath) {
                // Scroll directo si ya estás en la página
                const el = document.querySelector(href);
                if (el) el.scrollIntoView({ behavior: "smooth" });
            } else {
                // Navegar a la página base y agregar hash
                navigate(`${basePath}${href}`);
            }
        } else {
            navigate(href);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(logout());
    };

    return (
        <>
            <header className="w-full z-10 ">
                <nav className="bg-[#aa1916] text-white text-sm">
                    <div className="container mx-auto flex items-center px-4 py-4">
                        <div className="flex gap-4">
                            <a
                                href="https://ww2.ufps.edu.co/universidad/perfiles/aspirantes/952"
                                className="flex items-center gap-2 hover:text-gray-200 transition-colors"
                            >
                                <Users className="w-4 h-4" />
                                Aspirantes
                            </a>
                            <a
                                href="https://divisist2.ufps.edu.co/"
                                className="flex items-center gap-2 hover:text-gray-200 transition-colors"
                            >
                                <User className="w-4 h-4" />
                                Estudiantes
                            </a>
                            <a
                                href="https://ww2.ufps.edu.co/universidad/egresados/2225"
                                className="flex items-center gap-2 hover:text-gray-200 transition-colors"
                            >
                                <GraduationCap className="w-4 h-4" />
                                Graduados
                            </a>
                            <a
                                href="https://docentes.ufps.edu.co/"
                                className="flex items-center gap-2 hover:text-gray-200 transition-colors"
                            >
                                <UserCog className="w-4 h-4" />
                                Docentes
                            </a>
                            <a
                                href="https://administrativos.ufps.edu.co/"
                                className="flex items-center gap-2 hover:text-gray-200 transition-colors"
                            >
                                <BriefcaseBusiness className="w-4 h-4" />
                                Administrativos
                            </a>
                            <a
                                href="https://ww2.ufps.edu.co/universidad/seccion_participa_2021/2329"
                                className="flex items-center gap-2 hover:text-gray-200 transition-colors"
                            >
                                <BriefcaseBusiness className="w-4 h-4" />
                                Participa
                            </a>
                        </div>
                    </div>
                </nav>
                <div
                    className="relative w-full bg-center bg-no-repeat bg-cover flex justify-between items-center px-20 py-6"
                    style={{
                        backgroundImage: `url(${bannerBackground})`,
                    }}
                >
                    <a href=" https://ww2.ufps.edu.co/">
                        <img src={logoUfps} alt="Logo UFPS" className="h-40 object-contain" />
                    </a>
                    <a href="http://www.colombia.co/">
                        <img
                            src={escudoColombia}
                            alt="Escudo República de Colombia"
                            className="h-38 object-contain"
                        />
                    </a>
                </div>
            </header>
            <nav className="w-full sticky top-0 z-50 flex gap-4 py-2 px-4 bg-[#424242] text-white justify-between items-center shadow-md transition-all duration-300">
                <div className="flex">
                    <img src={logoLandscape} alt="logo" className="h-11" />
                </div>

                <div className="flex gap-4">
                    {items.map((item) => (
                        item.label === "FAQ" ? (
                            <button
                                key={item.href}
                                onClick={() => dispatch(toggleSidebar())}
                                className="hover:text-red-600"
                            >
                                {item.label}
                            </button>
                        ) : (
                            <button
                                key={item.href}
                                onClick={() => handleNavClick(item.href)}
                                className="hover:text-red-600"
                            >
                                {item.label}
                            </button>
                        )
                    ))}
                </div>

                <div>
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
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
        </>
    );
};

export default Navbar;
