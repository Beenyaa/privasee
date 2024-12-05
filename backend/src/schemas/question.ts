import { z } from "zod";

// Schema for creating a question
export const createQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  questionDescription: z.string().optional(),
  properties: z.record(z.string()).nullable().optional(),
  answer: z.string().optional(),
  assignedTo: z.string().email().optional(),
});

// Schema for updating an answer
export const updateAnswerSchema = z.object({
  answer: z.string().min(1, "Answer is required"),
});

// Schema for bulk assign
export const bulkAssignSchema = z
  .object({
    ids: z.array(z.string()).min(1, "At least one question ID is required"),
    assignedTo: z.string().email("Invalid email format"),
  })
  .strict();

// Full Question model schema
export const questionSchema = z.object({
  recordId: z.string(),
  companyName: z.string(),
  companyId: z.number(),
  question: z.string().min(1, "Question is required"),
  questionDescription: z.string().nullable(),
  properties: z.record(z.string()).nullable(),
  answer: z.string().nullable(),
  createdAt: z.string(),
  createdBy: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string(),
  assignedTo: z.string().email().nullable(),
});

export type QuestionSchema = z.infer<typeof questionSchema>;
