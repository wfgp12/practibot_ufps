import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import Logo from "@/assets/logo_landscape.png";

export const ChatbotSidebar = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.sidebarOpen);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/10 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-md rounded-l-lg z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        w-full md:w-1/2 lg:w-1/2 max-w-2xl flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <img src={Logo} alt="Logo" className="w-48" />
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1 rounded hover:bg-gray-200 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 flex flex-col p-4 gap-3">
          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto border border-gray-200 rounded p-3 bg-gray-50">
            <p className="text-gray-700 text-sm">Mensajes del chat...</p>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
            <button className="bg-[#aa1916] text-white px-4 py-2 rounded hover:bg-[#b5251e] transition">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
