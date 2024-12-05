import React, { useState } from "react";
import { Users } from "lucide-react";

interface BulkAssignBarProps {
  selectedCount: number;
  onAssign: (email: string) => void;
  onClear: () => void;
}

export const BulkAssignBar: React.FC<BulkAssignBarProps> = ({
  selectedCount,
  onAssign,
  onClear,
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onAssign(email.trim());
      setEmail("");
    }
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-700">
            {selectedCount} questions selected
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Assign to email"
            className="px-3 py-1 border border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Assign
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        </form>
      </div>
    </div>
  );
};
