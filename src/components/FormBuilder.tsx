/**
 * TODO: wrap around the text on mobile
 */
'use client';
import { Reorder } from 'framer-motion';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormData } from '../types/form';
import FormPreview from './FormPreview';
import { ShortAnswerQuestion } from '@/lib/questions';
import { QuestionBlock } from './QuestionBlock';
import {
  DraftIcon,
  PlusIcon,
  PreviewIcon,
  PublishIcon,
} from './icons/DropdownIcons';

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
          className="text-base font-semibold focus:outline-none w-full"
        />
        <button
          onClick={() => setShowPreview(true)}
          className="border rounded-xl px-4 py-[6px] text-base font-semibold flex items-center gap-2"
        >
          Preview <PreviewIcon />
        </button>
      </div>

      <div className="space-y-4 px-6">
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
          className="border border-gray-300 rounded-xl px-[14px] py-[6px] text-base font-semibold flex items-center gap-1 mt-5"
        >
          <PlusIcon /> Add question
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#F6F8FAE5] py-4 px-6 border-t border-[#E1E4E8]">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              /* TODO: Implement save draft functionality */
            }}
            className="flex items-center gap-1 hover:text-gray-800 text-sm font-semibold border px-4 py-[6px] rounded-xl bg-white"
          >
            <DraftIcon />
            Save as Draft
          </button>
          <button
            onClick={() => {
              /* TODO: Implement publish functionality */
            }}
            className="flex items-center gap-1 bg-[#00AA45] border border-[#1E874B] hover:bg-[#6AB39C] text-white px-4 py-[6px] rounded-xl font-semibold text-sm"
          >
            <PublishIcon />
            Publish form
          </button>
        </div>
      </div>
    </div>
  );
}
