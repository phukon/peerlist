export type QuestionType = 'short' | 'long' | 'single' | 'number' | 'url';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  options?: string[]; // For single select questions
}

export interface FormData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface FormResponse {
  [key: string]: string | number; // questionId: answer
} 