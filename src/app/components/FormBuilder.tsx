'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormData, Question, QuestionType } from '../types/form';
import FormPreview from './FormPreview';
import {
  ShortAnswerQuestion,
  LongAnswerQuestion,
  SingleSelectQuestion,
  NumberQuestion,
  URLQuestion
} from '@/lib/questions';
import { QuestionBlock } from './QuestionBlock';

export default function FormBuilder() {
  const [formData, setFormData] = useState<FormData>({
    id: uuidv4(),
    title: '',
    description: '',
    questions: [],
  });

  const [showPreview, setShowPreview] = useState(false);

  const addQuestion = (type: QuestionType) => {
    let newQuestion;
    
    switch (type) {
      case 'short':
        newQuestion = new ShortAnswerQuestion('', false);
        break;
      case 'long':
        newQuestion = new LongAnswerQuestion('', false);
        break;
      case 'single':
        newQuestion = new SingleSelectQuestion('', ['Option 1'], false);
        break;
      case 'number':
        newQuestion = new NumberQuestion('', false);
        break;
      case 'url':
        newQuestion = new URLQuestion('', false);
        break;
    }

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion.toJSON()],
    }));
  };

  // const updateQuestion = (questionId: string, updates: Partial<Question>) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     questions: prev.questions.map((q) =>
  //       q.id === questionId ? { ...q, ...updates } : q
  //     ),
  //   }));
  // };

  // const deleteQuestion = (questionId: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     questions: prev.questions.filter((q) => q.id !== questionId),
  //   }));
  // };

  const handlePreview = () => {
    setShowPreview(true);
    // TODO: send form data to backend
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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
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
          <QuestionBlock key={question.id} question={question} />
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
        onClick={handlePreview}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
      >
        Preview Form
      </button>
    </div>
  );
} 