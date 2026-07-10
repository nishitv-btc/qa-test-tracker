import { useState, useEffect, useMemo, useRef } from "react";
import EditIcon from "../assets/icons/edit.svg";
import DuplicateIcon from "../assets/icons/duplicate.svg";
import DeleteIcon from "../assets/icons/delete.svg";
import { Pencil, Copy, Trash2, Bug } from "lucide-react";
import { Filter, X } from "lucide-react";
import { Columns3 } from "lucide-react";
const statusOptions = ["", "Pass", "Fail", "Not Applicable", "Unable to Test"];

function getStatusClass(status) {
  switch (status) {
    case "Pass":
      return "bg-green-100 text-green-700 border-green-300";

    case "Fail":
      return "bg-red-100 text-red-700 border-red-300";

    case "Not Applicable":
      return "bg-gray-100 text-gray-700 border-gray-300";

    case "Unable to Test":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";

    default:
      return "bg-white text-gray-600 border-gray-300";
  }
}

function renderComment(comment) {
  if (!comment) return "-";

  // Existing URL support
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // BUG-1234 or BUG:1234
  const bugRegex = /(BUG[-:]?\s*\d+)/i;

  // Plain numeric Bug ID (4+ digits)
  const numericBugRegex = /^\d{4,}$/;

  if (bugRegex.test(comment)) {
    const bug = comment.match(bugRegex)[0];
    const bugId = bug.replace(/\D/g, "");

    return (
      <a
        href={`https://bugtracker.boston-technology.com/issues/${bugId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline font-medium"
      >
        🐞 {bug.toUpperCase()}
      </a>
    );
  }

  if (numericBugRegex.test(comment.trim())) {
    return (
      <a
        href={`https://bugtracker.boston-technology.com/issues/${comment.trim()}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline font-medium"
      >
        #️{comment.trim()}
      </a>
    );
  }

  const parts = comment.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all"
        >
          {part}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

function TestTable({
  testCases,
  updateStatus,
  updateComments,
  onEdit,
  onDelete,
  onDuplicate,
  onCreateBug,
  statusFilter,
  setStatusFilter,
  visibleColumns,
  setVisibleColumns,
}) {
  const [showColumnChooser, setShowColumnChooser] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);
  const columnChooserRef = useRef(null);
  const columnNames = {
    tcId: "TC ID",
    module: "Module",
    subModule: "Sub Module",
    description: "Description",
    preCondition: "Pre-condition",
    testSteps: "Test Case Steps",
    expectedResult: "Expected Result",
    actualResult: "Actual Result",
    status: "Status",
    executionDate: "Execution Date",
    comments: "Comments / Bug ID",
    actions: "Actions",
  };
  const rowNumber = useMemo(() => {
    return testCases.reduce((acc, item, index) => {
      acc[item.id] = index + 1;
      return acc;
    }, {});
  }, [testCases]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        columnChooserRef.current &&
        !columnChooserRef.current.contains(event.target)
      ) {
        setShowColumnChooser(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}

      <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center relative">
        <h2 className="text-xl font-bold">Test Execution</h2>

        <div className="relative" ref={columnChooserRef}>
          <button
            onClick={() => setShowColumnChooser((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer hover:text-gray-200"
          >
            <Filter size={18} />
            Columns
          </button>

          {showColumnChooser && (
            <div className="absolute top-14 right-0 bg-white text-black shadow-xl rounded-lg p-4 w-72 max-h-[400px] overflow-y-auto z-50 border">
              <h3 className="font-semibold mb-3">Show / Hide Columns</h3>

              {Object.entries(columnNames)
                .filter(([key]) => key !== "actions")
                .map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-100 rounded px-2"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns[key]}
                      onChange={() =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }))
                      }
                    />

                    {label}
                  </label>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="table-container overflow-x-auto max-h-[70vh]">
        <table className="min-w-full border-collapse table-fixed">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {visibleColumns.tcId && (
                <th className="border p-3 min-w-[80px]">TC ID</th>
              )}
              {visibleColumns.module && (
                <th className="border p-3 min-w-[100px]">Module</th>
              )}
              {visibleColumns.subModule && (
                <th className="border p-3 min-w-[120px]">Sub Module</th>
              )}
              {visibleColumns.description && (
                <th className="border p-3 min-w-[300px]">Description</th>
              )}
              {visibleColumns.preCondition && (
                <th className="border p-3 min-w-[150px]">Pre-condition</th>
              )}
              {visibleColumns.testSteps && (
                <th className="border p-3 min-w-[250px]">Test Case Steps</th>
              )}
              {visibleColumns.expectedResult && (
                <th className="border p-3 min-w-[200px]">Expected Result</th>
              )}
              {visibleColumns.actualResult && (
                <th className="border p-3 min-w-[180px]">Actual Result</th>
              )}
              {visibleColumns.status && (
                <th className="border p-3 min-w-[170px]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Status</span>

                    {showFilter ? (
                      <div className="flex items-center gap-1">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="border rounded-md px-2 py-1 text-sm bg-white outline-none cursor-pointer"
                        >
                          <option value="All">All</option>
                          <option value="">Pending</option>
                          <option value="Pass">Pass</option>
                          <option value="Fail">Fail</option>
                          <option value="Not Applicable">Not Applicable</option>
                          <option value="Unable to Test">Unable to Test</option>
                        </select>

                        <button
                          onClick={() => {
                            setStatusFilter("All");
                            setShowFilter(false);
                          }}
                          className="text-gray-500 hover:text-red-500 transition cursor-pointer"
                          title="Clear Filter"
                        >
                          <X size={16} strokeWidth={2} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowFilter(true)}
                        className="cursor-pointer text-gray-500 hover:text-blue-600 transition"
                        title="Filter"
                      >
                        <Filter size={18} />
                      </button>
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.executionDate && (
                <th className="border p-3 min-w-[140px]">Execution Date</th>
              )}
              {visibleColumns.comments && (
                <th className="border p-3 min-w-[150px]">Bug ID/Comments</th>
              )}
              <th className="border p-3 min-w-[80px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {testCases.length === 0 ? (
              <tr>
                <td
                  colSpan={Object.values(visibleColumns).filter(Boolean).length}
                >
                  No test cases found. Add Test Cases or Import an Excel file to
                  begin.
                </td>
              </tr>
            ) : (
              testCases.map((testCase) => (
                <tr key={testCase.id} className="hover:bg-blue-50 transition">
                  {visibleColumns.tcId && (
                    <td className="border p-3 font-medium">
                      {testCase.tcId || "-"}
                    </td>
                  )}

                  {visibleColumns.module && (
                    <td className="border p-3">{testCase.module}</td>
                  )}

                  {visibleColumns.subModule && (
                    <td className="border p-3">{testCase.subModule}</td>
                  )}

                  {visibleColumns.description && (
                    <td className="border p-3 whitespace-pre-wrap align-top">
                      {testCase.description}
                    </td>
                  )}

                  {visibleColumns.preCondition && (
                    <td className="border p-3 whitespace-pre-wrap">
                      {testCase.preCondition || "-"}
                    </td>
                  )}

                  {visibleColumns.testSteps && (
                    <td className="border p-3 whitespace-pre-wrap break-words">
                      {testCase.testSteps || "-"}
                    </td>
                  )}

                  {visibleColumns.expectedResult && (
                    <td className="border p-3 whitespace-pre-wrap break-words">
                      {testCase.expectedResult}
                    </td>
                  )}

                  {visibleColumns.actualResult && (
                    <td className="border p-3 whitespace-pre-wrap break-words">
                      {testCase.actualResult || "-"}
                    </td>
                  )}

                  {visibleColumns.status && (
                    <td className="border p-3">
                      <select
                        value={testCase.status}
                        onChange={(e) =>
                          updateStatus(testCase.id, e.target.value)
                        }
                        className={`w-full border rounded-md p-2 font-semibold outline-none cursor-pointer ${getStatusClass(
                          testCase.status,
                        )}`}
                      >
                        <option value="">Pending</option>

                        {statusOptions
                          .filter((status) => status !== "")
                          .map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                      </select>
                    </td>
                  )}

                  {visibleColumns.executionDate && (
                    <td className="border p-3 text-sm">
                      {testCase.executionDate || "-"}
                    </td>
                  )}

                  {visibleColumns.comments && (
                    <td className="border p-3">
                      <div className="max-w-xs break-words">
                        {renderComment(testCase.comments)}
                      </div>
                    </td>
                  )}
                  <td className="border p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(testCase.id)}
                        title="Edit"
                        className="cursor-pointer text-gray-600 hover:text-blue-800 transition-transform duration-200 hover:scale-110"
                      >
                        <Pencil size={20} strokeWidth={2} />
                      </button>

                      <button
                        onClick={() => onDuplicate(testCase)}
                        title="Duplicate"
                        className="cursor-pointer text-gray-600 hover:text-green-600 transition-transform duration-200 hover:scale-110"
                      >
                        <Copy size={20} strokeWidth={2} />
                      </button>

                      <button
                        onClick={() => onCreateBug(testCase)}
                        title="Create Redmine Bug"
                        className="cursor-pointer text-gray-600 hover:text-red-600 transition-transform duration-200 hover:scale-110"
                      >
                        <Bug size={22} strokeWidth={2} />
                      </button>

                      <button
                        onClick={() => onDelete(testCase.id)}
                        title="Delete"
                        className="cursor-pointer text-gray-600 hover:text-red-500 transition-transform duration-200 hover:scale-110"
                      >
                        <Trash2 size={20} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TestTable;
