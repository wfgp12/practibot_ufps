import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { markAsRead } from "@/store/slices/notificationsSlice";

const NotificationBell = () => {
  const dispatch = useAppDispatch();
  const { items, unreadCount } = useAppSelector((state) => state.notifications);

  return (
    <Popover>
      <PopoverTrigger className="relative p-2 rounded-full hover:bg-neutral-700 transition">
        <Bell className="w-6 h-6 text-white" />

        {unreadCount > 0 && (
          <span className="
            absolute -top-1 -right-1 bg-red-600 text-white 
            text-xs font-bold w-5 h-5 flex items-center justify-center 
            rounded-full
          ">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0 bg-neutral-800 text-white border-none">
        <div className="p-3 border-b border-neutral-700 font-semibold">
          Notificaciones
        </div>

        <ScrollArea className="h-64">
          {items.length === 0 ? (
            <div className="p-4 text-sm text-gray-400 text-center">
              No tienes notificaciones
            </div>
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                onClick={() => dispatch(markAsRead(n.id))}
                className={`p-3 border-b border-neutral-700 cursor-pointer 
                  hover:bg-neutral-700 transition
                  ${!n.leida ? "bg-neutral-700/40" : ""}`}
              >
                <p className="font-semibold">{n.titulo}</p>
                <p className="text-sm text-gray-300">{n.mensaje}</p>
                <p className="text-xs text-gray-500 mt-1">{n.fecha}</p>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
