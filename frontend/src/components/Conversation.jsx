import { useChatStore } from "../store/useChatStore";

const Conversation = ({ conversation, isOnline, isSelected }) => {
  const { setSelectedUser } = useChatStore();

  const handleClick = () => {
    setSelectedUser(conversation);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-base-200"
      }`}
    >
      <div className="relative">
        <img
          src={conversation.profilePic || "/avatar.png"}
          alt={conversation.fullName}
          className="size-12 object-cover rounded-full"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{conversation.fullName}</div>
        <div className="text-sm text-base-content/60 truncate">
          {conversation.email}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
