import axios, { AxiosError } from "axios";
import { CreateQuestionDTO, Question } from "@privasee/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleError = (error: AxiosError) => {
  if (error.code === "ERR_NETWORK") {
    console.error("Network error: Unable to connect to the server");
    throw new Error(
      "Unable to connect to the server. Please check if the backend is running.",
    );
  }
  console.error("API Error:", error.response?.data || error.message);
  throw error;
};

export const questionApi = {
  getQuestions: async () => {
    try {
      const { data } = await api.get<Question[]>("/questions");
      return data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  createQuestion: async (data: CreateQuestionDTO) => {
    try {
      const { data: response } = await api.post<Question>("/questions", data);
      return response;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  updateQuestion: async (
    recordId: string,
    data: Partial<CreateQuestionDTO>,
  ) => {
    try {
      const { data: response } = await api.post<Question>(
        `/questions/${recordId}`,
        data,
      );
      return response;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  deleteQuestion: async (recordId: string) => {
    try {
      const { data } = await api.delete(`/questions/${recordId}`);
      return data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  assignQuestions: async (recordIds: string[], assignedTo: string) => {
    try {
      const { data } = await api.post("/questions/bulk-assign", {
        ids: recordIds,
        assignedTo,
      });
      return data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  searchQuestions: async (term: string) => {
    try {
      if (!term.trim()) {
        return [];
      }
      const { data } = await api.get<Question[]>(
        `/questions/search?q=${encodeURIComponent(term.trim())}`,
      );
      return data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },
};
