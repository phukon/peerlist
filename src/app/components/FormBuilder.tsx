'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormData, Question, QuestionType } from '../types/form';
import FormPreview from './FormPreview';

export default function FormBuilder() {
  const [formData, setFormData] = useState<FormData>({
    id: uuidv4(),
    title: '',
    description: '',
    questions: [],
  });

  const [showPreview, setShowPreview] = useState(false);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: uuidv4(),
      type,
      question: '',
      required: false,
      ...(type === 'single' && { options: ['Option 1'] }),
    };

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);

    console.log('Form data:', formData);
  };

  if (showPreview) {
    return (
      <FormPreview
        form={formData}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Form Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Form Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-4">
          {formData.questions.map((question) => (
            <div key={question.id} className="border p-4 rounded">
              <input
                type="text"
                placeholder="Question"
                value={question.question}
                onChange={(e) =>
                  updateQuestion(question.id, { question: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              {question.type === 'single' && (
                <div className="space-y-2">
                  {question.options?.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(question.options || [])];
                        newOptions[index] = e.target.value;
                        updateQuestion(question.id, { options: newOptions });
                      }}
                      className="w-full p-2 border rounded"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      updateQuestion(question.id, {
                        options: [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`],
                      })
                    }
                    className="text-blue-500 hover:text-blue-600"
                  >
                    + Add Option
                  </button>
                </div>
              )}
              <div className="flex items-center mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) =>
                      updateQuestion(question.id, { required: e.target.checked })
                    }
                    className="mr-2"
                  />
                  Required
                </label>
                <button
                  type="button"
                  onClick={() => deleteQuestion(question.id)}
                  className="ml-auto text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => addQuestion('short')}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            + Short Answer
          </button>
          <button
            type="button"
            onClick={() => addQuestion('long')}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            + Long Answer
          </button>
          <button
            type="button"
            onClick={() => addQuestion('single')}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            + Single Select
          </button>
          <button
            type="button"
            onClick={() => addQuestion('number')}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            + Number
          </button>
          <button
            type="button"
            onClick={() => addQuestion('url')}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            + URL
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
        >
          Preview Form
        </button>
      </form>
    </div>
  );
} 