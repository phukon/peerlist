import * as React from 'react';
import { useMotionValue, Reorder, useDragControls } from 'framer-motion';
import { useRaisedShadow } from '@/hooks/useRaisedShadow';
import { ReorderIcon } from './icon/GrabHandle';
import { Question } from '../types/form';

interface Props {
  question: Question;
}

export const QuestionBlock = ({ question }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={question}
      // id={question.id}
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
      <ReorderIcon dragControls={dragControls} />
    </Reorder.Item>
  );
};
