import React from "react";
import { useForm } from "react-hook-form";
import { CreateQuestionDTO } from "@privasee/types";

interface QuestionFormProps {
  onSubmit: (data: CreateQuestionDTO) => void;
  initialData?: Partial<CreateQuestionDTO>;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  onSubmit,
  initialData = {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateQuestionDTO>({
    defaultValues: {
      ...initialData,
      properties: initialData.properties || {},
    },
  });

  const handleFormSubmit = async (data: CreateQuestionDTO) => {
    try {
      // Clean up properties
      const properties = Object.entries(data.properties || {})
        .filter(([_, value]) => value) // Remove empty values
        .reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: value,
          }),
          {},
        );

      const formData = {
        ...data,
        properties: Object.keys(properties).length > 0 ? properties : null,
      };

      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (you might want to show an error message to the user)
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Question
        </label>
        <textarea
          {...register("question", { required: "Question is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
        {errors.question && (
          <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          {...register("questionDescription")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Answer (Optional)
        </label>
        <textarea
          {...register("answer")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Assign To (Optional)
        </label>
        <input
          type="email"
          {...register("assignedTo")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Properties (Optional)
        </label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <input
            type="text"
            {...register("properties.section")}
            placeholder="Section"
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            {...register("properties.vendor")}
            placeholder="Vendor"
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
};
