'use client';

import { useState, useEffect } from 'react';
import { FormData, FormResponse, Question } from '../types/form';

interface FormPreviewProps {
  form: FormData;
  onBack: () => void;
}

export default function FormPreview({ form, onBack }: FormPreviewProps) {
  const [responses, setResponses] = useState<FormResponse>({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    calculateCompletion();
  }, [responses]);

  const calculateCompletion = () => {
    const requiredQuestions = form.questions.filter((q) => q.required);
    if (requiredQuestions.length === 0) return setCompletionPercentage(0);

    const answeredRequired = requiredQuestions.filter(
      (q) => responses[q.id] && responses[q.id].toString().trim() !== ''
    );

    const percentage = (answeredRequired.length / requiredQuestions.length) * 100;
    setCompletionPercentage(Math.round(percentage));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Form responses:', responses);
  };

  const renderQuestion = (question: Question) => {
    const value = responses[question.id] || '';

    switch (question.type) {
      case 'short':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) =>
              setResponses((prev) => ({
                ...prev,
                [question.id]: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            required={question.required}
          />
        );

      case 'long':
        return (
          <textarea
            value={value}
            onChange={(e) =>
              setResponses((prev) => ({
                ...prev,
                [question.id]: e.target.value,
              }))
            }
            className="w-full p-2 border rounded min-h-[100px]"
            required={question.required}
          />
        );

      case 'single':
        return (
          <select
            value={value}
            onChange={(e) =>
              setResponses((prev) => ({
                ...prev,
                [question.id]: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              setResponses((prev) => ({
                ...prev,
                [question.id]: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            required={question.required}
          />
        );

      case 'url':
        return (
          <input
            type="url"
            value={value}
            onChange={(e) =>
              setResponses((prev) => ({
                ...prev,
                [question.id]: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            required={question.required}
            placeholder="https://"
          />
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          Form submitted successfully! Thank you for your response.
        </div>
        <button
          onClick={onBack}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Form
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>Form Completion:</span>
          <span>{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.questions.map((question) => (
          <div key={question.id} className="border p-4 rounded">
            <label className="block mb-2">
              {question.question}
              {question.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            {renderQuestion(question)}
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Editor
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
} 