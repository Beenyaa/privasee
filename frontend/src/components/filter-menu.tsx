import React from "react";
import { useQuestionStore } from "../store/useQuestionStore";
import { Calendar, Tag, Users, X } from "lucide-react";

interface FilterMenuProps {
  onClose: () => void;
}

export const FilterMenu: React.FC<FilterMenuProps> = ({ onClose }) => {
  const { filters, setFilters, questions } = useQuestionStore();

  // Get unique properties from all questions
  const uniqueProperties = React.useMemo(() => {
    const props = new Map<string, Set<string>>();
    questions.forEach((q) => {
      if (q.properties) {
        Object.entries(q.properties).forEach(([key, value]) => {
          if (!props.has(key)) {
            props.set(key, new Set());
          }
          props.get(key)?.add(value);
        });
      }
    });
    return props;
  }, [questions]);

  const handleClearFilter = (filterType: string, propertyKey?: string) => {
    if (propertyKey) {
      const newProperties = { ...filters.properties };
      delete newProperties[propertyKey];
      setFilters({ properties: newProperties });
    } else {
      switch (filterType) {
        case "assignmentStatus":
          setFilters({ assignmentStatus: "all" });
          break;
        case "dateRange":
          setFilters({ dateRange: undefined });
          break;
        case "properties":
          setFilters({ properties: {} });
          break;
      }
    }
  };

  const hasActiveFilters =
    filters.assignmentStatus !== "all" ||
    filters.dateRange?.start ||
    filters.dateRange?.end ||
    Object.keys(filters.properties || {}).length > 0;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setFilters({
                assignmentStatus: "all",
                dateRange: undefined,
                properties: {},
              });
            }}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Assignment Status */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            Assignment Status
          </label>
          <select
            value={filters.assignmentStatus || "all"}
            onChange={(e) =>
              setFilters({ assignmentStatus: e.target.value as any })
            }
            className="w-full border border-gray-300 rounded-md px-2 py-1.5"
          >
            <option value="all">All</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            Date Range
          </label>
          <div className="flex flex-wrap gap-2">
            {" "}
            <input
              type="date"
              value={
                filters.dateRange?.start?.toISOString().split("T")[0] || ""
              }
              onChange={(e) =>
                setFilters({
                  dateRange: {
                    ...filters.dateRange,
                    start: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  },
                })
              }
              className="min-w-[120px] flex-1 border border-gray-300 rounded-md px-2 py-1.5"
            />
            <input
              type="date"
              value={filters.dateRange?.end?.toISOString().split("T")[0] || ""}
              onChange={(e) =>
                setFilters({
                  dateRange: {
                    ...filters.dateRange,
                    end: e.target.value ? new Date(e.target.value) : undefined,
                  },
                })
              }
              className="min-w-[120px] flex-1 border border-gray-300 rounded-md px-2 py-1.5"
            />
          </div>
        </div>

        {/* Properties */}
        {Array.from(uniqueProperties.entries()).map(([key, values]) => (
          <div key={key} className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="w-4 h-4" />
              {key}
            </label>
            <select
              value={filters.properties?.[key] || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFilters({
                  properties: {
                    ...filters.properties,
                    [key]: value,
                  },
                });
              }}
              className="w-full border border-gray-300 rounded-md px-2 py-1.5"
            >
              <option value="">All</option>
              {Array.from(values).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};
