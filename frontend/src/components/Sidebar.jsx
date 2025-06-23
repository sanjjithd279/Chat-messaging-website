import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import Conversation from "./Conversation";
import { Loader2 } from "lucide-react";

const Sidebar = () => {
  const { conversations, selectedUser, isConversationsLoading, selectedClass } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 flex flex-col flex-1">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {selectedClass
            ? `${selectedClass.name} - Classmates`
            : "Conversations"}
        </h2>
        {selectedClass && (
          <p className="text-sm text-base-content/60">
            {conversations.length} classmates
          </p>
        )}
      </div>

      {isConversationsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2">
          {conversations.map((conversation) => (
            <Conversation
              key={conversation._id}
              conversation={conversation}
              isOnline={onlineUsers.includes(conversation._id)}
              isSelected={selectedUser?._id === conversation._id}
            />
          ))}
        </div>
      )}

      {!isConversationsLoading && conversations.length === 0 && (
        <div className="text-center py-8 text-base-content/60">
          {selectedClass ? "No classmates found" : "No conversations yet"}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
