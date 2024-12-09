/**
 * TODO: Down icon in the dropdown button
 */

import { useMotionValue, Reorder, useDragControls } from 'framer-motion';
import { useRaisedShadow } from '@/hooks/useRaisedShadow';
import { ReorderIcon } from './icons/GrabHandle';
import {
  Short,
  LongText,
  SingleSelect,
  UrlIcon,
  NumberIcon,
  DownIcon,
  PlusIcon,
  DeleteIcon,
} from './icons/DropdownIcons';
import { Question, FormData } from '../types/form';
import { updateQuestion, deleteQuestion } from '@/lib/questionUtils';
import { Dispatch, SetStateAction, useState, useRef, useEffect } from 'react';
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

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div
        key={question.id}
        className="border py-2 px-4 rounded-2xl bg-white hover:bg-[#FAFBFC] mt-4"
      >
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            placeholder="Write a question"
            value={question.question}
            onChange={(e) => handleUpdateQuestion({ question: e.target.value })}
            className="w-full p-2 text-sm font-semibold rounded-xl"
          />
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 p-2 rounded-lg bg-white border"
            >
              {(() => {
                const Icon = questionTypes.find(
                  (q) => q.type === question.type
                )?.icon;
                return Icon ? <Icon /> : null;
              })()}
            </button>

            {isOpen && (
              <div
                className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10
                animate-in fade-in duration-300 slide-in-from-top-1 scale-95 origin-top"
              >
                {questionTypes.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2
                      transition-colors duration-150"
                    onClick={() => {
                      handleTypeChange(type);
                      setIsOpen(false);
                    }}
                  >
                    <Icon />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <ReorderIcon dragControls={dragControls} />
        </div>

        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Write a help text or caption (leave empty if not needed)"
              value={question.helpText || ''}
              onChange={(e) =>
                handleUpdateQuestion({ helpText: e.target.value })
              }
              className="w-full py-1 px-2 text-sm text-gray-500 focus:outline-none focus:border-gray-300"
            />
            {question.type !== 'single' && (
              <input
                type="text"
                className="w-full mt-2 p-2 text-xs border bg-[#F6F8FA] border-[#E1E4E8] rounded-xl focus:border-gray-300 text-gray-500"
              />
            )}
          </div>
        </div>

        {question.type === 'single' && (
          <div className="space-y-2 mt-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(question.options || [])];
                    newOptions[index] = e.target.value;
                    handleUpdateQuestion({ options: newOptions });
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleUpdateQuestion({
                  options: [...(question.options || []), ``],
                })
              }
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-600 ml-7"
            >
              <PlusIcon />
              <span>Add option</span>
            </button>
          </div>
        )}

        <div className="flex items-center">
          {/* <label className="flex items-center">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) =>
                handleUpdateQuestion({ required: e.target.checked })
              }
              className="mr-2"
            />
            Required
          </label> */}
          <button
            type="button"
            onClick={handleDeleteQuestion}
            className="ml-auto text-red-700 hover:text-red-600"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
};
