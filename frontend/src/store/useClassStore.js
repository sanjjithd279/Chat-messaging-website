import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useClassStore = create((set, get) => ({
  classes: [],
  selectedClass: null,
  isClassesLoading: false,
  isCreatingClass: false,
  isJoiningClass: false,

  getClasses: async () => {
    set({ isClassesLoading: true });
    try {
      const res = await axiosInstance.get("/classes/user-classes");
      set({ classes: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load classes");
    } finally {
      set({ isClassesLoading: false });
    }
  },

  createClass: async (classData) => {
    set({ isCreatingClass: true });
    try {
      const res = await axiosInstance.post("/classes/create", classData);
      set({ classes: [...get().classes, res.data] });
      toast.success("Class created successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create class");
      throw error;
    } finally {
      set({ isCreatingClass: false });
    }
  },

  joinClass: async (code) => {
    set({ isJoiningClass: true });
    try {
      const res = await axiosInstance.post("/classes/join", { code });
      set({ classes: [...get().classes, res.data] });
      toast.success("Successfully joined class!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join class");
      throw error;
    } finally {
      set({ isJoiningClass: false });
    }
  },

  setSelectedClass: (selectedClass) => set({ selectedClass }),
}));
