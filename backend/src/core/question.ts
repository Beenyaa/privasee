import { Question } from "@privasee/types";

type CreateQuestionParams = {
  question: string;
  questionDescription?: string;
  currentUser: string;
  properties?: Record<string, string> | null;
};

export const QuestionCore = {
  createQuestion: (params: CreateQuestionParams) => {
    const now = new Date().toISOString();
    return {
      recordId: `rec${Math.random().toString(36).substr(2, 9)}`,
      question: params.question,
      questionDescription: params.questionDescription || "",
      properties: params.properties || null,
      createdAt: now,
      updatedAt: now,
      createdBy: params.currentUser,
      updatedBy: params.currentUser,
      answer: "",
      assignedTo: "",
      companyName: "",
      companyId: 0,
    };
  },

  updateAnswer: (
    question: Question,
    params: {
      answer: string;
      currentUser: string;
    },
  ) => ({
    ...question,
    answer: params.answer,
    updatedAt: new Date().toISOString(),
    updatedBy: params.currentUser,
  }),

  assignQuestion: (
    question: Question,
    params: {
      assignedTo: string;
      currentUser: string;
    },
  ) => ({
    ...question,
    assignedTo: params.assignedTo,
    updatedAt: new Date().toISOString(),
    updatedBy: params.currentUser,
  }),

  addProperty: (question: Question, key: string, value: string) => ({
    ...question,
    properties: {
      ...(question.properties || {}),
      [key]: value,
    },
  }),

  filterByAssignee: (questions: Question[], assignedTo: string) =>
    questions.filter((q) => q.assignedTo === assignedTo),

  filterByProperty: (questions: Question[], key: string, value: string) =>
    questions.filter((q) => q.properties?.[key] === value),
};
