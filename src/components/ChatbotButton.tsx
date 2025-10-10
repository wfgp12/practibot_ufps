import { MessageCircle } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";

export const ChatbotButton = () => {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => dispatch(toggleSidebar())}
      className="fixed bottom-14 right-6 z-50 w-14 h-14 bg-[#aa1916] hover:bg-[#bb1916] text-white rounded-full shadow-lg flex items-center justify-center"
    >
      <MessageCircle size={28} />
    </button>
  );
};
