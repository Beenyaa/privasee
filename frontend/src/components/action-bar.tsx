import React, { useState, useRef } from "react";
import { Plus, Filter, X } from "lucide-react";
import { SearchBar } from "./search-bar";
import { FilterMenu } from "./filter-menu"; // We'll create this
import { useOnClickOutside } from "../hooks/useOnClickOutside"; // We'll create this

interface ActionBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewQuestion: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  searchTerm,
  onSearchChange,
  onNewQuestion,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(filterRef, () => setShowFilters(false));

  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <SearchBar value={searchTerm} onChange={onSearchChange} />
      <div className="flex items-center gap-2">
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 ${
              showFilters ? "bg-gray-50 border-gray-400" : "border-gray-300"
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          {showFilters && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <FilterMenu onClose={() => setShowFilters(false)} />
            </div>
          )}
        </div>
        <button
          onClick={onNewQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          New Question
        </button>
      </div>
    </div>
  );
};
