import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { Send, Image as ImageIcon, Loader2 } from "lucide-react";

const MessageInput = () => {
  const { selectedUser, sendMessage, isSendingMessage } = useChatStore();
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !image) return;

    try {
      const messageData = {
        text: message.trim(),
        image: image,
      };

      await sendMessage(messageData, selectedUser._id);
      setMessage("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!selectedUser) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {imagePreview && (
        <div className="relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-[200px] rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full size-6 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input input-bordered flex-1"
          disabled={isSendingMessage}
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-outline btn-square"
          disabled={isSendingMessage}
        >
          <ImageIcon className="size-5" />
        </button>

        <button
          type="submit"
          className="btn btn-primary btn-square"
          disabled={isSendingMessage || (!message.trim() && !image)}
        >
          {isSendingMessage ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Send className="size-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
