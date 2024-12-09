'use client';

import { useState, useEffect } from 'react';
import { FormData, FormResponse, Question } from '../types/form';
import {
  ShortAnswerQuestion,
  LongAnswerQuestion,
  SingleSelectQuestion,
  NumberQuestion,
  URLQuestion,
  BaseQuestion,
} from '@/lib/questions';
import { PreviewIcon, DraftIcon, PublishIcon } from './icons/DropdownIcons';

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
    const totalQuestions = form.questions.length;
    if (totalQuestions === 0) return setCompletionPercentage(0);

    const answeredQuestions = form.questions.filter(
      (q) => responses[q.id] && responses[q.id].toString().trim() !== ''
    );

    const percentage = (answeredQuestions.length / totalQuestions) * 100;
    setCompletionPercentage(Math.round(percentage));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = form.questions
      .map((question) => {
        const value = responses[question.id];
        return {
          question: question.question,
          valid: validateResponse(question, value),
        };
      })
      .filter((result) => !result.valid);

    if (validationErrors.length > 0) {
      alert(
        `Please check the following questions:\n${validationErrors
          .map((e) => e.question)
          .join('\n')}`
      );
      return;
    }

    setSubmitted(true);
    console.log('Form responses:', responses);
  };

  const renderQuestion = (question: Question) => {
    const value = responses[question.id] || '';
    const baseInputClass =
      'w-full p-2 text-sm border border-[#E1E4E8] rounded-xl focus:border-gray-300 bg-[#F6F8FA]';

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
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) =>
                    setResponses((prev) => ({
                      ...prev,
                      [question.id]: e.target.value,
                    }))
                  }
                  className="sr-only" // Hide the actual radio input
                />
                <div
                  className={`w-4 h-4 rounded-full border flex-shrink-0 ${
                    value === option
                      ? 'border-[#00AA45] bg-[#00AA45]'
                      : 'border-gray-300'
                  }`}
                >
                  {value === option && (
                    <div className="w-2 h-2 bg-white rounded-full m-[3px]" />
                  )}
                </div>
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
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

  const validateResponse = (question: Question, value: any): boolean => {
    let questionInstance: BaseQuestion;

    switch (question.type) {
      case 'short':
        questionInstance = new ShortAnswerQuestion(
          question.question,
          question.required
        );
        break;
      case 'long':
        questionInstance = new LongAnswerQuestion(
          question.question,
          question.required
        );
        break;
      case 'single':
        questionInstance = new SingleSelectQuestion(
          question.question,
          question.options || [],
          question.required
        );
        break;
      case 'number':
        questionInstance = new NumberQuestion(
          question.question,
          question.required
        );
        break;
      case 'url':
        questionInstance = new URLQuestion(
          question.question,
          question.required
        );
        break;
      default:
        return false;
    }

    return (questionInstance as any).validate(value);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col border-2 border-gray-300 md:mx-52 xl:mx-72">
        <div className="flex flex-row justify-between py-4 px-6 border-b-2 border-gray-300 items-center">
          <h1 className="text-base font-semibold">{form.title}</h1>
        </div>
        <div className="p-6 text-center">
          <div className="bg-[#ECFDF3] text-[#027A48] p-4 rounded-xl mb-4">
            Form submitted successfully! Thank you for your response.
          </div>
          <button
            onClick={onBack}
            className="border rounded-xl px-4 py-[6px] text-base font-semibold flex items-center gap-2 mx-auto"
          >
            <PreviewIcon /> Back to Editor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col border-2 border-gray-300 md:mx-52 xl:mx-72 relative pb-16">
      <div className="sticky top-0 z-10 bg-white flex flex-row justify-between py-4 px-6 border-b-2 border-gray-300 items-center">
        <h1 className="text-base font-semibold">{form.title}</h1>
        <div className="flex items-center gap-4 w-1/2">
          <span className="text-sm text-gray-600">Form completeness —</span>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300 bg-[#00AA45]"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-semibold min-w-[40px]">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {form.description && (
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-gray-600">{form.description}</p>
        </div>
      )}

      <div className="px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {form.questions.map((question) => (
            <div
              key={question.id}
              className="border py-2 px-4 rounded-2xl bg-white hover:bg-[#FAFBFC]"
            >
              <label className="block mb-2">
                <span className="text-sm font-semibold">
                  {question.question}
                </span>
                {question.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                {question.helpText && (
                  <p className="text-sm text-gray-500 mt-1">
                    {question.helpText}
                  </p>
                )}
              </label>
              {renderQuestion(question)}
            </div>
          ))}
        </form>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#F6F8FAE5] py-4 px-6 border-t border-[#E1E4E8]">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:text-gray-800 text-sm font-semibold border px-4 py-[6px] rounded-xl bg-white"
          >
            <DraftIcon />
            Back to Editor
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1 bg-[#00AA45] border border-[#1E874B] hover:bg-[#6AB39C] text-white px-4 py-[6px] rounded-xl font-semibold text-sm"
          >
            <PublishIcon />
            Submit Form
          </button>
        </div>
      </div>
    </div>
  );
}
