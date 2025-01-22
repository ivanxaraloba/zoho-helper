import { supabase } from "@/utils/supabase/client";
import { create } from "zustand";

type GlobalState = {
  projects: any[];
  getProjects: () => Promise<any>;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  projects: [],
  getProjects: async () => {
    try {
      const { data, error } = await supabase
        .from("zohodesk_oauth")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ projects: data });
    } catch (error) {
      console.error("Unexpected error while fetching projects:", error);
    }
  },
}));
