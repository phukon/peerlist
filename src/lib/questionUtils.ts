import { Question } from "@/app/types/form";

export const updateQuestion = (questionId: string, updates: Partial<Question>) => {
  setFormData((prev) => ({
    ...prev,
    questions: prev.questions.map((q) =>
      q.id === questionId ? { ...q, ...updates } : q
    ),
  }));
};

export const deleteQuestion = (questionId: string) => {
  setFormData((prev) => ({
    ...prev,
    questions: prev.questions.filter((q) => q.id !== questionId),
  }));
};