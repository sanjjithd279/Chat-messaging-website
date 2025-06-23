import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import MessageInput from "./MessageInput";
import Message from "./Message";
import { Loader2 } from "lucide-react";

const ChatContainer = () => {
  const { selectedUser, messages, getMessages, isMessagesLoading, addMessage } =
    useChatStore();
  const { socket } = useAuthStore();
  const lastMessageRef = useRef();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      if (message.senderId === selectedUser?._id) {
        addMessage(message);
      }
    });

    return () => socket?.off("newMessage");
  }, [socket, addMessage, selectedUser]);

  if (!selectedUser) return null;

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-base-100">
      {/* Header */}
      <div className="bg-base-100 border-b border-base-300 p-4 shrink-0">
        <div className="flex items-center gap-3">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="size-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/60">{selectedUser.email}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <Message message={message} />
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="border-t border-base-300 p-4 shrink-0">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
