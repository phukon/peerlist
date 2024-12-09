import { useMotionValue, Reorder, useDragControls } from 'framer-motion';
import { useRaisedShadow } from '@/hooks/useRaisedShadow';
import { ReorderIcon } from './icons/GrabHandle';
import { Short, LongText, SingleSelect, UrlIcon, NumberIcon } from './icons/DropdownIcons';
import { Question, FormData } from '../types/form';
import { updateQuestion, deleteQuestion } from '@/lib/questionUtils';
import { Dispatch, SetStateAction } from 'react';
import {
  ShortAnswerQuestion,
  LongAnswerQuestion,
  SingleSelectQuestion,
  NumberQuestion,
  URLQuestion,
} from '@/lib/questions';

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

  const questionTypes = [
    { type: 'short', label: 'Short Answer', icon: Short },
    { type: 'long', label: 'Long Answer', icon: LongText },
    { type: 'single', label: 'Single Select', icon: SingleSelect },
    { type: 'number', label: 'Number', icon: NumberIcon },
    { type: 'url', label: 'URL', icon: UrlIcon },
  ] as const;

  const handleTypeChange = (newType: Question['type']) => {
    let updatedQuestion;

    switch (newType) {
      case 'short':
        updatedQuestion = new ShortAnswerQuestion(
          question.question,
          question.required
        );
        break;
      case 'long':
        updatedQuestion = new LongAnswerQuestion(
          question.question,
          question.required
        );
        break;
      case 'single':
        updatedQuestion = new SingleSelectQuestion(
          question.question,
          ['Option 1'],
          question.required
        );
        break;
      case 'number':
        updatedQuestion = new NumberQuestion(
          question.question,
          question.required
        );
        break;
      case 'url':
        updatedQuestion = new URLQuestion(question.question, question.required);
        break;
    }

    handleUpdateQuestion(updatedQuestion.toJSON());
  };

  return (
    <Reorder.Item
      value={question}
      style={{ boxShadow, y, borderRadius: 16 }}
      dragListener={false}
      dragControls={dragControls}
    >
      <div key={question.id} className="border p-4 rounded-2xl bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Write a question"
            value={question.question}
            onChange={(e) => handleUpdateQuestion({ question: e.target.value })}
            className="w-full p-2 text-sm font-semibold rounded-xl"
          />
          <div className="relative">
            <select
              value={question.type}
              onChange={(e) => handleTypeChange(e.target.value as Question['type'])}
              className="appearance-none w-10 h-10 p-2 rounded-lg bg-white"
              style={{ 
                textIndent: '-999px',
                textAlign: 'center' 
              }}
            >
              {questionTypes.map(({ type, label, icon: Icon }) => (
                <option key={type} value={type} className="text-center">
                  {label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {(() => {
                const Icon = questionTypes.find(q => q.type === question.type)?.icon;
                return Icon ? <Icon /> : null;
              })()}
            </div>
          </div>
          <ReorderIcon dragControls={dragControls} />
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Write a help text or caption (leave empty if not needed)"
              value={question.helpText || ''}
              onChange={(e) =>
                handleUpdateQuestion({ helpText: e.target.value })
              }
              className="w-full mt-2 p-2 text-sm text-gray-500 focus:outline-none focus:border-gray-300"
            />
            <input
              type="text"
              className="w-full mt-2 p-2 text-s border border-gray-300 rounded-xl focus:border-gray-300 text-gray-500"
            />
          </div>
        </div>

        {question.type === 'single' && (
          <div className="space-y-2 ml-4">
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

        <div className="flex items-center mt-4">
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
    </Reorder.Item>
  );
};
