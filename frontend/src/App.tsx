import React, { useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { questionApi } from "./services/api";
import { Header } from "./components/header";
import { ActionBar } from "./components/action-bar";
import { BulkAssignBar } from "./components/bulk-assign-bar";
import { Modal } from "./components/modal";
import { QuestionForm } from "./components/question-form";
import { QuestionList } from "./components/question-list";
import { useQuestionStore } from "./store/useQuestionStore";

const queryClient = new QueryClient();

function QAApp() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedQuestions, clearSelection, setQuestions, setFilters } =
    useQuestionStore();

  const {
    data: questions,
    error,
    isError,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: questionApi.getQuestions,
  });

  // Only update store when questions change and are not undefined
  useEffect(() => {
    if (questions && Array.isArray(questions)) {
      setQuestions(questions);
    }
  }, [questions]);

  const createQuestionMutation = useMutation({
    mutationFn: questionApi.createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      setShowForm(false);
    },
  });

  const assignQuestionsMutation = useMutation({
    mutationFn: ({
      recordIds,
      assignedTo,
    }: {
      recordIds: string[];
      assignedTo: string;
    }) => questionApi.assignQuestions(recordIds, assignedTo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      clearSelection();
    },
  });

  const handleBulkAssign = (email: string) => {
    if (selectedQuestions.size > 0) {
      assignQuestionsMutation.mutate({
        recordIds: Array.from(selectedQuestions),
        assignedTo: email,
      });
    }
  };

  const searchQuestionsMutation = useMutation({
    mutationFn: questionApi.searchQuestions,
    onSuccess: (data) => {
      setQuestions(data); // Update the base questions with search results
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim()) {
        searchQuestionsMutation.mutate(searchTerm);
      } else {
        // If search term is empty, reset to showing all questions
        queryClient.invalidateQueries({ queryKey: ["questions"] });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />

        {isError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error instanceof Error
              ? error.message
              : "An error occurred while fetching questions"}
          </div>
        )}

        <ActionBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onNewQuestion={() => setShowForm(true)}
        />
        {selectedQuestions.size > 0 && (
          <BulkAssignBar
            selectedCount={selectedQuestions.size}
            onAssign={handleBulkAssign}
            onClear={clearSelection}
          />
        )}

        {showForm && (
          <Modal title="New Question" onClose={() => setShowForm(false)}>
            <QuestionForm
              onSubmit={(data) => createQuestionMutation.mutate(data)}
            />
          </Modal>
        )}

        <QuestionList />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QAApp />
    </QueryClientProvider>
  );
}

export default App;
