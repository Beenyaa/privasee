import { QuestionCore } from "../core/question";
import { AirtableRepository } from "../repositories/airtable";
import { Question, CreateQuestionDTO } from "@privasee/types";
import { SearchService } from "../core/search";

type CreateQuestionParams = {
  data: CreateQuestionDTO;
  currentUser: string;
};

type UpdateQuestionParams = {
  currentUser: string;
  question?: string;
  questionDescription?: string;
  answer?: string;
  assignedTo?: string;
  properties?: Record<string, string> | null;
};

export const QuestionOperations = {
  getQuestions: async () => {
    const questions = await AirtableRepository.getAllQuestions();

    return questions;
  },

  createQuestion: async ({ data, currentUser }: CreateQuestionParams) => {
    try {
      const question = QuestionCore.createQuestion({
        question: data.question,
        questionDescription: data.questionDescription,
        currentUser,
        properties: data.properties,
      });

      const created = await AirtableRepository.createQuestion(question);

      return created;
    } catch (error) {
      console.error("Error in createQuestion operation:", error);
      throw error;
    }
  },

  updateQuestion: async (id: string, params: UpdateQuestionParams) => {
    try {
      // Get current question state
      const currentQuestion = await AirtableRepository.getQuestion(id);
      if (!currentQuestion) {
        throw new Error("Question not found");
      }

      // Prepare update data
      const updateData: Partial<Question> = {
        ...params,
        updatedAt: new Date().toISOString(),
        updatedBy: params.currentUser,
      };

      // Handle side effects through repository
      return AirtableRepository.updateQuestion(id, updateData);
    } catch (error) {
      console.error("Error in updateQuestion operation:", error);
      throw error;
    }
  },

  deleteQuestion: async (id: string) => {
    try {
      // Get current question state to verify it exists
      const question = await AirtableRepository.getQuestion(id);
      if (!question) {
        throw new Error("Question not found");
      }

      // Delete through repository
      return AirtableRepository.deleteQuestion(id);
    } catch (error) {
      console.error("Error in deleteQuestion operation:", error);
      throw error;
    }
  },

  bulkAssign: async (
    ids: string[],
    assignedTo: string,
    currentUser: string,
  ) => {
    try {
      // Get all questions first
      const questions = await Promise.all(
        ids.map(async (id) => {
          try {
            return await AirtableRepository.getQuestion(id);
          } catch (error) {
            console.error(`Error fetching question ${id}:`, error);
            throw new Error(`Failed to fetch question ${id}`);
          }
        }),
      );

      // Use core logic to create updated questions
      const updatedQuestions = questions.map((question) =>
        QuestionCore.assignQuestion(question, { assignedTo, currentUser }),
      );

      // Handle side effects through repository
      const results = await Promise.all(
        updatedQuestions.map(async (question) => {
          try {
            const result = await AirtableRepository.updateQuestion(
              question.recordId,
              question,
            );
            return result;
          } catch (error) {
            console.error(
              `Error updating question ${question.recordId}:`,
              error,
            );
            throw new Error(
              `Failed to update question ${question.recordId}: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
          }
        }),
      );

      return results;
    } catch (error) {
      console.error("Error in bulk assign:", error);
      throw error;
    }
  },

  search: async (searchTerm: string) => {
    try {
      const questions = await AirtableRepository.getAllQuestions();
      return SearchService.search(questions, searchTerm);
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    }
  },

  getQuestionTerms: async (questionId: string) => {
    try {
      const questions = await AirtableRepository.getAllQuestions();
      const questionIndex = questions.findIndex(
        (q) => q.recordId === questionId,
      );

      if (questionIndex === -1) {
        throw new Error("Question not found");
      }

      return SearchService.getTermImportance(questions, questionIndex);
    } catch (error) {
      console.error("Error getting term importance:", error);
      throw error;
    }
  },

  filterByAssignee: async (assignedTo: string) => {
    const questions = await AirtableRepository.getAllQuestions();
    return QuestionCore.filterByAssignee(questions, assignedTo);
  },

  filterByProperty: async (key: string, value: string) => {
    const questions = await AirtableRepository.getAllQuestions();
    return QuestionCore.filterByProperty(questions, key, value);
  },
};
