import React, { useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Question, CreateQuestionDTO } from "@privasee/types";
import { Modal } from "./modal";
import { QuestionForm } from "./question-form";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionApi } from "../services/api";

interface QuestionItemProps {
  question: Question;
  isSelected: boolean;
  onToggleSelect: (recordId: string) => void;
}

const transformQuestionForForm = (
  question: Question,
): Partial<CreateQuestionDTO> => {
  return {
    question: question.question,
    questionDescription: question.questionDescription || undefined,
    answer: question.answer || undefined,
    assignedTo: question.assignedTo || undefined,
    properties: question.properties || undefined,
  };
};

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  isSelected,
  onToggleSelect,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  const updateQuestionMutation = useMutation({
    mutationFn: ({ recordId, data }: { recordId: string; data: any }) =>
      questionApi.updateQuestion(recordId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      setShowEditModal(false);
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: questionApi.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      setShowDeleteModal(false);
    },
  });

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return "Invalid date";
      }
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <tr className={isSelected ? "bg-blue-50" : "hover:bg-gray-50"}>
        <td className="px-3 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(question.recordId)}
            className="rounded border-gray-300"
          />
        </td>
        <td className="px-3 py-4">
          <div className="flex flex-col space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-900">
                {question.question}
              </span>
              {question.questionDescription && (
                <span className="text-sm text-gray-500 block">
                  {question.questionDescription}
                </span>
              )}
            </div>
            {question.answer && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Answer:</span> {question.answer}
                </span>
              </div>
            )}
          </div>
        </td>
        <td className="px-3 py-4">
          <div className="flex items-center">
            {question.assignedTo ? (
              <>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {question.assignedTo[0].toUpperCase()}
                </div>
                <span className="ml-2 text-sm text-gray-900">
                  {question.assignedTo}
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">Unassigned</span>
            )}
          </div>
        </td>
        <td className="px-3 py-4 text-sm text-gray-500">
          {formatDate(question.updatedAt)}
        </td>
        <td className="px-3 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Pencil className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-red-100 rounded-full"
            >
              <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
            </button>
          </div>
        </td>
      </tr>

      {showEditModal && (
        <Modal title="Edit Question" onClose={() => setShowEditModal(false)}>
          <QuestionForm
            initialData={transformQuestionForForm(question)}
            onSubmit={(data) =>
              updateQuestionMutation.mutate({
                recordId: question.recordId,
                data,
              })
            }
          />
        </Modal>
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={() => deleteQuestionMutation.mutate(question.recordId)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};
