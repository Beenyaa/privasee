import { create } from "zustand";
import { Question } from "@privasee/types";

interface QuestionState {
  questions: Question[];
  selectedQuestions: Set<string>;
  filters: {
    assignedTo?: string;
    assignmentStatus?: "all" | "assigned" | "unassigned";
    properties?: Record<string, string>;
    searchTerm?: string;
    dateRange?: {
      start?: Date;
      end?: Date;
    };
  };
  setQuestions: (questions: Question[]) => void;
  toggleSelection: (recordId: string) => void;
  clearSelection: () => void;
  setFilters: (filters: Partial<QuestionState["filters"]>) => void;
  getFilteredQuestions: () => Question[];
  setSelectedQuestions: (questions: Set<string>) => void;
  searchResults: Question[] | null;
  setSearchResults: (results: Question[] | null) => void;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  selectedQuestions: new Set(),
  filters: {
    assignmentStatus: "all",
    properties: {},
  },
  searchResults: null,

  setQuestions: (questions) => set({ questions }),

  toggleSelection: (recordId) =>
    set((state) => {
      const newSelection = new Set(state.selectedQuestions);
      if (newSelection.has(recordId)) {
        newSelection.delete(recordId);
      } else {
        newSelection.add(recordId);
      }
      return { selectedQuestions: newSelection };
    }),

  clearSelection: () => set({ selectedQuestions: new Set() }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
        // Ensure properties is always an object
        properties: {
          ...state.filters.properties,
          ...(newFilters.properties || {}),
        },
      },
    })),

  setSelectedQuestions: (questions) => set({ selectedQuestions: questions }),

  setSearchResults: (results) => set({ searchResults: results }),

  getFilteredQuestions: () => {
    const { questions, filters, searchResults } = get();

    // If we have search results, use those instead of applying client-side filtering
    const baseQuestions = searchResults || questions;

    return baseQuestions.filter((q) => {
      let passes = true;

      // Filter by assignment status
      if (filters.assignmentStatus && filters.assignmentStatus !== "all") {
        if (filters.assignmentStatus === "assigned" && !q.assignedTo) {
          passes = false;
        }
        if (filters.assignmentStatus === "unassigned" && q.assignedTo) {
          passes = false;
        }
      }

      // Filter by date range
      if (passes && filters.dateRange) {
        const questionDate = new Date(q.updatedAt);
        if (filters.dateRange.start) {
          const startDate = new Date(filters.dateRange.start);
          startDate.setHours(0, 0, 0, 0);
          if (questionDate < startDate) {
            passes = false;
          }
        }
        if (filters.dateRange.end) {
          const endDate = new Date(filters.dateRange.end);
          endDate.setHours(23, 59, 59, 999);
          if (questionDate > endDate) {
            passes = false;
          }
        }
      }

      // Filter by properties
      if (
        passes &&
        filters.properties &&
        Object.keys(filters.properties).length > 0
      ) {
        for (const [key, value] of Object.entries(filters.properties)) {
          if (value && (!q.properties || q.properties[key] !== value)) {
            passes = false;
            break;
          }
        }
      }

      return passes;
    });
  },
}));
