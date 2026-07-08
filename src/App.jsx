import { useEffect, useMemo, useState } from "react";

import Dashboard from "./components/Dashboard";
import SearchFilter from "./components/SearchFilter";
import TestTable from "./components/TestTable";
import ExcelImport from "./components/ExcelImport";
import ExportExcel from "./components/ExportExcel";
import AddEditModal from "./components/AddEditModal";
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
  const [showModal, setShowModal] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState(null);

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
      prev.map((item) => {
        if (item.id !== id) return item;

        let executionDate = item.executionDate;

        if (
          status &&
          status !== "" &&
          (!item.executionDate || item.executionDate === "")
        ) {
          executionDate = new Date().toLocaleString();
        }

        return {
          ...item,
          status,
          executionDate,
        };
      }),
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

  // Add / Edit Test Case
  const saveTestCase = (testCase) => {
    if (editingTestCase) {
      // Edit existing test case

      setTestCases((prev) =>
        prev.map((item) =>
          item.id === editingTestCase.id
            ? {
                ...item,
                module: testCase.module,
                subModule: testCase.subModule,
                description: testCase.description,
                status: testCase.status,
                comments: testCase.comments,
              }
            : item,
        ),
      );
    } else {
      // Add new test case

      const nextId =
        testCases.length > 0
          ? Math.max(...testCases.map((t) => Number(t.id))) + 1
          : 1;

      setTestCases((prev) => [
        ...prev,
        {
          module: testCase.module,
          subModule: testCase.subModule,
          description: testCase.description,
          status: testCase.status,
          comments: testCase.comments,
          executionDate:
            testCase.status !== "" ? new Date().toLocaleString() : "",
        },
      ]);
    }

    // Close popup

    setEditingTestCase(null);
    setShowModal(false);
  };

  const duplicateTestCase = (testCase) => {
    const nextId =
      testCases.length > 0
        ? Math.max(...testCases.map((t) => Number(t.id))) + 1
        : 1;

    const duplicate = {
      ...testCase,
      status: "",
      comments: "",
      executionDate: "",
    };

    setTestCases((prev) => [...prev, duplicate]);
  };

  const deleteTestCase = (id) => {
    if (!window.confirm("Delete this test case?")) return;

    setTestCases((prev) => prev.filter((item) => item.id !== id));
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

            <button
              onClick={() => {
                setEditingTestCase(null);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
            >
              ➕ Add Test Case
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
          onEdit={(testCase) => {
            setEditingTestCase(testCase);
            setShowModal(true);
          }}
          onDelete={deleteTestCase}
          onDuplicate={duplicateTestCase}
        />

        <AddEditModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingTestCase(null);
          }}
          onSave={saveTestCase}
          editingTestCase={editingTestCase}
        />
      </div>
    </div>
  );
}

export default App;
