export interface Question {
  recordId: string;
  companyName: string;
  companyId: number;
  question: string;
  questionDescription: string | null;
  answer: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  assignedTo: string | null;
  properties: Record<string, string> | null;
}

export interface CreateQuestionDTO {
  question: string;
  questionDescription?: string;
  properties?: Record<string, string> | null;
  answer?: string;
  assignedTo?: string;
}
