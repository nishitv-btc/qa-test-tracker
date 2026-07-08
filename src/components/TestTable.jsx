import { useMemo } from "react";

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
              <th className="border p-3 w-16">#</th>

              <th className="border p-3 text-left">Module</th>

              <th className="border p-3 text-left">Sub Module</th>

              <th className="border p-3 text-left">Description</th>

              <th className="border p-3 text-center w-56">Status</th>

              <th className="border p-3 text-left w-72">Comments</th>

              <th className="border p-3 text-center w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {testCases.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No test cases found. Please import an Excel file to begin.
                </td>
              </tr>
            ) : (
              testCases.map((testCase) => (
                <tr key={testCase.id} className="hover:bg-blue-50 transition">
                  <td className="border p-3 text-center font-semibold">
                    {rowNumber[testCase.id]}
                  </td>

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

                  <td className="border p-3">
                    <textarea
                      rows="2"
                      value={testCase.comments}
                      placeholder="Enter comments..."
                      onChange={(e) =>
                        updateComments(testCase.id, e.target.value)
                      }
                      className="w-full border rounded-md p-2 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </td>

                  <td className="border p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(testCase)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                        title="Edit"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => onDuplicate(testCase)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                        title="Duplicate"
                      >
                        📄
                      </button>

                      <button
                        onClick={() => onDelete(testCase.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                        title="Delete"
                      >
                        🗑️
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
