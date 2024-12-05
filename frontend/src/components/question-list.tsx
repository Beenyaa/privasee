import React from "react";
import { QuestionItem } from "./question-item";
import { useQuestionStore } from "../store/useQuestionStore";

export const QuestionList: React.FC = () => {
  const {
    selectedQuestions,
    toggleSelection,
    getFilteredQuestions,
    setSelectedQuestions,
  } = useQuestionStore();

  const filteredQuestions = getFilteredQuestions();

  const handleMasterToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Select all filtered questions
      setSelectedQuestions(new Set(filteredQuestions.map((q) => q.recordId)));
    } else {
      // Clear selection
      setSelectedQuestions(new Set());
    }
  };

  if (filteredQuestions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No questions found</div>
    );
  }

  const allFilteredSelected = filteredQuestions.every((q) =>
    selectedQuestions.has(q.recordId),
  );

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="w-8 px-3 py-3">
              <input
                type="checkbox"
                checked={allFilteredSelected}
                onChange={handleMasterToggle}
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Question & Answer
            </th>
            <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Assigned To
            </th>
            <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            <th className="w-8 px-3 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredQuestions.map((question) => (
            <QuestionItem
              key={question.recordId}
              question={question}
              isSelected={selectedQuestions.has(question.recordId)}
              onToggleSelect={toggleSelection}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
