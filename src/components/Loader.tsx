import { useAppSelector } from "@/store/hooks";


const LoaderBottomRight = () => {
  const loading = useAppSelector((state) => state.ui.loading);

  if (!loading) return null;

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-[#272727] text-white px-4 py-3 rounded-xl shadow-lg z-50 animate-fadeIn">
      <div className="w-4 h-4 border-2 border-t-[#b43432] border-gray-500 rounded-full animate-spin" />
      <span className="text-sm">Cargando...</span>
    </div>
  );
};

export default LoaderBottomRight;
