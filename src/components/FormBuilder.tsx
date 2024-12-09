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
    title: '',
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

  const handlePreview = () => {
    setShowPreview(true);
    // TODO: send form data to backend
    console.log('Form data:', formData);
  };

  if (showPreview) {
    return <FormPreview form={formData} onBack={() => setShowPreview(false)} />;
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

      <button
        type="button"
        onClick={addQuestion}
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 w-full"
      >
        Add Question
      </button>

      <button
        onClick={handlePreview}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
      >
        Preview Form
      </button>
    </div>
  );
}
