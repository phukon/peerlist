import * as React from 'react';
import { useMotionValue, Reorder, useDragControls } from 'framer-motion';
import { useRaisedShadow } from '@/hooks/useRaisedShadow';
import { ReorderIcon } from './icon/GrabHandle';
import { Question, FormData } from '../types/form';
import { updateQuestion, deleteQuestion } from '@/lib/questionUtils';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  question: Question;
  setFormData: Dispatch<SetStateAction<FormData>>;
}

export const QuestionBlock = ({ question, setFormData }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  const handleUpdateQuestion = (updates: Partial<Question>) => {
    updateQuestion(question.id, updates, setFormData);
  };

  const handleDeleteQuestion = () => {
    deleteQuestion(question.id, setFormData);
  };

  return (
    <Reorder.Item
      value={question}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
    >
      <div key={question.id} className="border p-4 rounded">
        <input
          type="text"
          placeholder="Question"
          value={question.question}
          onChange={(e) =>
            handleUpdateQuestion({ question: e.target.value })
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
                  handleUpdateQuestion({ options: newOptions });
                }}
                className="w-full p-2 border rounded"
              />
            ))}
            <button
              type="button"
              onClick={() =>
                handleUpdateQuestion({
                  options: [
                    ...(question.options || []),
                    `Option ${(question.options?.length || 0) + 1}`,
                  ],
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
                handleUpdateQuestion({ required: e.target.checked })
              }
              className="mr-2"
            />
            Required
          </label>
          <button
            type="button"
            onClick={handleDeleteQuestion}
            className="ml-auto text-red-500 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
      <ReorderIcon dragControls={dragControls} />
    </Reorder.Item>
  );
};
