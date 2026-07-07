import { useEffect, useMemo, useState } from "react";

import Dashboard from "./components/Dashboard";
import SearchFilter from "./components/SearchFilter";
import TestTable from "./components/TestTable";
import ExcelImport from "./components/ExcelImport";
import ExportExcel from "./components/ExportExcel";
//import testCasesData from "./data/testcases";

const STORAGE_KEY = "qa-test-tracker";

function App() {
  const [testCases, setTestCases] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  // Auto Save
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testCases));
  }, [testCases]);

  // Dashboard Summary
  const summary = useMemo(() => {
    const total = testCases.length;

    const passed = testCases.filter((t) => t.status === "Pass").length;

    const failed = testCases.filter((t) => t.status === "Fail").length;

    const na = testCases.filter((t) => t.status === "Not Applicable").length;

    const unable = testCases.filter(
      (t) => t.status === "Unable to Test",
    ).length;

    const pending = total - passed - failed - na - unable;

    const completion =
      total === 0
        ? 0
        : Math.round(((passed + failed + na + unable) / total) * 100);

    return {
      total,
      passed,
      failed,
      na,
      unable,
      pending,
      completion,
    };
  }, [testCases]);

  // Search + Filter + Sort
  const filteredData = useMemo(() => {
    let data = [...testCases];

    if (search) {
      const value = search.toLowerCase();

      data = data.filter(
        (item) =>
          item.module.toLowerCase().includes(value) ||
          item.subModule.toLowerCase().includes(value) ||
          item.description.toLowerCase().includes(value),
      );
    }

    if (statusFilter === "") {
      data = data.filter((item) => !item.status);
    } else if (statusFilter !== "All") {
      data = data.filter((item) => item.status === statusFilter);
    }

    data.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.module.localeCompare(b.module);
      }

      return b.module.localeCompare(a.module);
    });

    return data;
  }, [testCases, search, statusFilter, sortOrder]);

  // Update Status
  const updateStatus = (id, status) => {
    setTestCases((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );
  };

  // Update Comments
  const updateComments = (id, comments) => {
    setTestCases((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              comments,
            }
          : item,
      ),
    );
  };

  // Reset All
  const resetExecution = () => {
    if (
      window.confirm("Clear all imported test cases and execution results?")
    ) {
      localStorage.removeItem(STORAGE_KEY);
      setTestCases([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}

      <div className="bg-blue-700 text-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">QA Test Execution Tracker</h1>

            <p className="text-blue-100 mt-1">Execute and Track Test Cases</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Dashboard summary={summary} />

        {/* Import / Export Buttons */}

        <div className="bg-white shadow rounded-xl p-5 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <ExcelImport
              setTestCases={setTestCases}
              resetTrigger={testCases.length === 0}
            />

            <ExportExcel testCases={testCases} />

            <button
              onClick={resetExecution}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow cursor-pointer transition"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        <SearchFilter
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <TestTable
          testCases={filteredData}
          updateStatus={updateStatus}
          updateComments={updateComments}
        />
      </div>
    </div>
  );
}

export default App;
