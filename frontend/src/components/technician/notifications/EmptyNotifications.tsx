import { BellOff } from "lucide-react";

const EmptyNotifications = () => {
  return (
    <div className="rounded-3xl bg-white p-12 text-center shadow-md">
      <BellOff size={42} className="mx-auto mb-4 text-gray-400" />

      <h3 className="text-lg font-semibold text-[#052836]">No Notifications</h3>

      <p className="mt-2 text-gray-500">
        You're all caught up. New notifications will appear here.
      </p>
    </div>
  );
};

export default EmptyNotifications;
