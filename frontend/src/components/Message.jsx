import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const Message = ({ message }) => {
  const { authUser } = useAuthStore();
  const isOwnMessage = message.senderId === authUser._id;

  return (
    <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="size-10 rounded-full">
          <img
            src={
              isOwnMessage
                ? authUser.profilePic || "/avatar.png"
                : message.sender?.profilePic || "/avatar.png"
            }
            alt="profile pic"
          />
        </div>
      </div>

      <div className="chat-header">
        <time className="text-xs opacity-50">
          {formatMessageTime(message.createdAt)}
        </time>
      </div>

      <div className="chat-bubble">
        {message.image && (
          <img
            src={message.image}
            alt="Attachment"
            className="max-w-[200px] rounded-md mb-2"
          />
        )}
        {message.text && <p>{message.text}</p>}
      </div>
    </div>
  );
};

export default Message;
