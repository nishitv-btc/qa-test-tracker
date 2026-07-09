import { useEffect, useMemo, useState } from "react";

import Dashboard from "./components/Dashboard";
import SearchFilter from "./components/SearchFilter";
import TestTable from "./components/TestTable";
import ExcelImport from "./components/ExcelImport";
import ExportExcel from "./components/ExportExcel";
import AddEditModal from "./components/AddEditModal";

const STORAGE_KEY = "qa-test-tracker";

function App() {
  const [testCases, setTestCases] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const editingTestCase = useMemo(
    () => testCases.find((t) => t.id === editingId) || null,
    [editingId, testCases],
  );

  // -----------------------------
  // Auto Save
  // -----------------------------

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testCases));
  }, [testCases]);

  // -----------------------------
  // Dashboard
  // -----------------------------

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

  // -----------------------------
  // Search / Filter
  // -----------------------------

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
      data = data.filter((x) => !x.status);
    } else if (statusFilter !== "All") {
      data = data.filter((x) => x.status === statusFilter);
    }

    return data;
  }, [testCases, search, statusFilter]);

  // -----------------------------
  // Update Status
  // -----------------------------

  const updateStatus = (id, status) => {
    setTestCases((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          status,
          executionDate:
            status && !item.executionDate
              ? new Date().toLocaleString()
              : item.executionDate,
        };
      }),
    );
  };

  // -----------------------------
  // Update Comments
  // -----------------------------

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

  // -----------------------------
  // Save Test Case
  // -----------------------------

  const saveTestCase = (testCase) => {
    if (editingId) {
      setTestCases((prev) =>
        prev.map((item) =>
          item.id === editingId
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
      setTestCases((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          module: testCase.module,
          subModule: testCase.subModule,
          description: testCase.description,
          status: testCase.status,
          comments: testCase.comments,
          executionDate: testCase.status ? new Date().toLocaleString() : "",
        },
      ]);
    }

    setEditingId(null);
    setShowModal(false);
  };

  // -----------------------------
  // Duplicate
  // -----------------------------

  const duplicateTestCase = (testCase) => {
    setTestCases((prev) => {
      const index = prev.findIndex((t) => t.id === testCase.id);

      const duplicate = {
        ...testCase,
        id: crypto.randomUUID(),
        status: "",
        comments: "",
        executionDate: "",
      };

      const updated = [...prev];
      updated.splice(index + 1, 0, duplicate);

      return updated;
    });
  };

  // -----------------------------
  // Delete
  // -----------------------------

  const deleteTestCase = (id) => {
    if (!window.confirm("Delete this test case?")) return;

    setTestCases((prev) => prev.filter((item) => item.id !== id));

    if (editingId === id) {
      setEditingId(null);
    }
  };

  // -----------------------------
  // Reset
  // -----------------------------

  const resetExecution = () => {
    if (!window.confirm("Clear all imported test cases?")) return;

    localStorage.removeItem(STORAGE_KEY);

    setTestCases([]);

    setEditingId(null);
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

        {/* Import / Export */}

        <div className="bg-white shadow rounded-xl p-5 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
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
                setEditingId(null);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow cursor-pointer transition"
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
        />

        <TestTable
          testCases={filteredData}
          updateStatus={updateStatus}
          updateComments={updateComments}
          onEdit={(id) => {
            setEditingId(id);
            setShowModal(true);
          }}
          onDelete={deleteTestCase}
          onDuplicate={duplicateTestCase}
        />

        <AddEditModal
          open={showModal}
          editingTestCase={editingTestCase}
          onSave={saveTestCase}
          onClose={() => {
            setShowModal(false);
            setEditingId(null);
          }}
        />
      </div>
    </div>
  );
}

export default App;
