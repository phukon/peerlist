'use client';
import { Reorder } from 'framer-motion';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormData, QuestionType } from '../types/form';
import FormPreview from './FormPreview';
import { ShortAnswerQuestion } from '@/lib/questions';
import { QuestionBlock } from './QuestionBlock';

export default function FormBuilder() {
  const [formData, setFormData] = useState<FormData>({
    id: uuidv4(),
    title: 'Untitled form',
    description: '',
    questions: [],
  });

  const [showPreview, setShowPreview] = useState(false);

  const addQuestion = () => {
    const newQuestion = new ShortAnswerQuestion('', false);
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion.toJSON()],
    }));
  };

  if (showPreview) {
    return <FormPreview form={formData} onBack={() => setShowPreview(false)} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col border-2 border-gray-300 md:mx-52 xl:mx-72 relative pb-16">
      <div className="flex flex-row justify-between py-4 px-6 border-b-2 border-gray-300 items-center">
        <input
          type="text"
          placeholder="Untitled form"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="text-base font-semibold text-gray-400 focus:outline-none"
        />
        <button
          onClick={() => setShowPreview(true)}
          className="text-gray-400 border rounded-xl px-4 py-[6px] text-base font-semibold"
        >
          Preview X
        </button>
      </div>

      <div className="space-y-4 px-6 py-4">
        <Reorder.Group
          axis="y"
          onReorder={(newOrder) =>
            setFormData((prev) => ({ ...prev, questions: newOrder }))
          }
          values={formData.questions}
        >
          {formData.questions.map((question) => (
            <QuestionBlock
              key={question.id}
              question={question}
              setFormData={setFormData}
            />
          ))}
        </Reorder.Group>
      </div>

      <div className="flex justify-center items-center py-4 px-6">
        <button
          onClick={addQuestion}
          className="border border-gray-300 rounded-xl px-[14px] py-[6px] text-base font-semibold mt-5"
        >
          + Add question
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gray-50 py-4 px-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {/* TODO: Implement save draft functionality */}}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8"
              />
            </svg>
            Save as Draft
          </button>
          <button
            onClick={() => {/* TODO: Implement publish functionality */}}
            className="bg-[#7BC5AE] hover:bg-[#6AB39C] text-white px-4 py-[6px] rounded-xl font-medium"
          >
            Publish form
          </button>
        </div>
      </div>
    </div>
  );
}
