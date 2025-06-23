import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
  selectedUser: null,
  selectedClass: null,
  messages: [],
  conversations: [],
  isMessagesLoading: false,
  isConversationsLoading: false,
  isSendingMessage: false,

  getConversations: async () => {
    set({ isConversationsLoading: true });
    try {
      const res = await axiosInstance.get("/messages/conversations");
      set({ conversations: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load conversations"
      );
    } finally {
      set({ isConversationsLoading: false });
    }
  },

  getClassStudents: async (classId) => {
    set({ isConversationsLoading: true });
    try {
      const res = await axiosInstance.get(
        `/messages/class/${classId}/students`
      );
      set({ conversations: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load class students"
      );
    } finally {
      set({ isConversationsLoading: false });
    }
  },

  getUsersByClass: async (classId) => {
    set({ isConversationsLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/class/${classId}/users`);
      set({ conversations: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load class users"
      );
    } finally {
      set({ isConversationsLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (message, receiverId) => {
    set({ isSendingMessage: true });
    try {
      const res = await axiosInstance.post(
        `/messages/send/${receiverId}`,
        message
      );
      set({ messages: [...get().messages, res.data] });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      throw error;
    } finally {
      set({ isSendingMessage: false });
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
  setSelectedClass: (classData) => set({ selectedClass: classData }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set({ messages: [...get().messages, message] }),
}));
