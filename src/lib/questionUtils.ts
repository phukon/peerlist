import { Question, FormData } from "@/types/form";
import { Dispatch, SetStateAction } from "react";

export const updateQuestion = (
  questionId: string, 
  updates: Partial<Question>,
  setFormData: Dispatch<SetStateAction<FormData>>
) => {
  setFormData((prev) => ({
    ...prev,
    questions: prev.questions.map((q) =>
      q.id === questionId ? { ...q, ...updates } : q
    ),
  }));
};

export const deleteQuestion = (
  questionId: string,
  setFormData: Dispatch<SetStateAction<FormData>>
) => {
  setFormData((prev) => ({
    ...prev,
    questions: prev.questions.filter((q) => q.id !== questionId),
  }));
};