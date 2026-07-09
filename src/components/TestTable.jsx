import { useMemo } from "react";
import EditIcon from "../assets/icons/edit.svg";
import DuplicateIcon from "../assets/icons/duplicate.svg";
import DeleteIcon from "../assets/icons/delete.svg";

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

function getPriorityClass(priority) {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";

    case "Medium":
      return "bg-yellow-100 text-yellow-700";

    case "Low":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function renderComment(comment) {
  if (!comment) return "-";

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const parts = comment.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
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
}) {
  const rowNumber = useMemo(() => {
    return testCases.reduce((acc, item, index) => {
      acc[item.id] = index + 1;
      return acc;
    }, {});
  }, [testCases]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}

      <div className="bg-blue-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold">Test Execution</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Module</th>

              <th className="border p-3">Sub Module</th>

              <th className="border p-3">Description</th>

              <th className="border p-3 text-center min-w-[170px]">Status</th>

              <th className="border p-3">Execution Date</th>

              <th className="border p-3">Comments</th>

              <th className="border p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {testCases.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No test cases found. Add Test Cases or Import an Excel file to
                  begin.
                </td>
              </tr>
            ) : (
              testCases.map((testCase) => (
                <tr key={testCase.id} className="hover:bg-blue-50 transition">
                  <td className="border p-3 font-medium">{testCase.module}</td>

                  <td className="border p-3">{testCase.subModule}</td>

                  <td className="border p-3">{testCase.description}</td>

                  <td className="border p-3">
                    <select
                      value={testCase.status}
                      onChange={(e) =>
                        updateStatus(testCase.id, e.target.value)
                      }
                      className={`w-full border rounded-md p-2 font-semibold outline-none ${getStatusClass(
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

                  <td className="border p-3 text-sm">
                    {testCase.executionDate || "-"}
                  </td>

                  <td className="border p-3">
                    <div className="max-w-xs break-words">
                      {renderComment(testCase.comments)}
                    </div>
                  </td>

                  <td className="border p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(testCase.id)}
                        title="Edit"
                        className="cursor-pointer transition-transform duration-200 hover:scale-110"
                      >
                        <img src={EditIcon} alt="Edit" className="w-7 h-7" />
                      </button>

                      <button
                        onClick={() => onDuplicate(testCase)}
                        title="Duplicate"
                        className="cursor-pointer transition-transform duration-200 hover:scale-110"
                      >
                        <img
                          src={DuplicateIcon}
                          alt="Duplicate"
                          className="w-7 h-7"
                        />
                      </button>

                      <button
                        onClick={() => onDelete(testCase.id)}
                        title="Delete"
                        className="cursor-pointer transition-transform duration-200 hover:scale-110"
                      >
                        <img
                          src={DeleteIcon}
                          alt="Delete"
                          className="w-8 h-8"
                        />
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
