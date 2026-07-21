import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth/AuthContext";
import Dashboard from "./components/Dashboard";
import SearchFilter from "./components/SearchFilter";
import TestTable from "./components/TestTable";
import Header from "./components/Header";
import ExcelImport from "./components/ExcelImport";
import ExportExcel from "./components/ExportExcel";
import AddEditModal from "./components/AddEditModal";
import {
  FileUp,
  FileDown,
  RotateCcw,
  Plus,
  Moon,
  Sun,
  ArrowUp,
} from "lucide-react";
import {
  DocumentArrowUp24Filled,
  DocumentArrowDown24Filled,
  ArrowClockwise24Filled,
  AddCircle24Filled,
} from "@fluentui/react-icons";

const STORAGE_KEY = "qa-test-tracker";
const THEME_STORAGE_KEY = "qa-test-tracker-theme";
const redmine_project_id = "thominternal";
const jira_id = "TH-2113";

function App() {
  const { keycloak, authenticated, user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [testCases, setTestCases] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [visibleColumns, setVisibleColumns] = useState({
    tcId: true,
    module: true,
    subModule: true,
    description: true,
    testSteps: true,
    preCondition: true,
    expectedResult: true,
    actualResult: true,
    status: true,
    executionDate: true,
    comments: true,
    actions: true,
  });

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

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const updateScrollButton = () => setShowScrollTop(window.scrollY > 250);

    window.addEventListener("scroll", updateScrollButton, { passive: true });
    updateScrollButton();

    return () => window.removeEventListener("scroll", updateScrollButton);
  }, []);

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

    if (search.trim()) {
      const value = search.toLowerCase().trim();

      data = data.filter((item) =>
        [
          item.tcId,
          item.module,
          item.subModule,
          item.description,
          item.preCondition,
          item.testSteps,
          item.expectedResult,
          item.actualResult,
          item.status,
          item.executionDate,
          item.comments,
        ]
          .filter(Boolean) // Ignore null/undefined
          .some((field) => field.toString().toLowerCase().includes(value)),
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
              ? new Date()
                  .toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .replace("am", "AM")
                  .replace("pm", "PM")
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
                tcId: testCase.tcId,
                module: testCase.module,
                subModule: testCase.subModule,
                description: testCase.description,
                testSteps: testCase.testSteps,
                preCondition: testCase.preCondition,
                expectedResult: testCase.expectedResult,
                actualResult: testCase.actualResult,
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

          tcId: testCase.tcId,

          module: testCase.module,

          subModule: testCase.subModule,

          description: testCase.description,

          testSteps: testCase.testSteps,

          preCondition: testCase.preCondition,

          expectedResult: testCase.expectedResult,

          actualResult: testCase.actualResult,

          status: "",

          executionDate: "",

          comments: testCase.comments,
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

  const createBug = (testCase) => {
    const subject = encodeURIComponent(
      `${jira_id} - ${testCase.module} > ${testCase.subModule}`,
    );

    const description = encodeURIComponent(`*Steps:*
1. 
2. 
3. 

*Actual Result:*

*Expected Result:*

*Screenshot/Video:*
`);

    const redmineUrl =
      `https://bugtracker.boston-technology.com/projects/${redmine_project_id}/issues/new` +
      `?issue[subject]=${subject}` +
      `&issue[description]=${description}`;

    window.open(redmineUrl, "_blank");
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
    <div
      className={`app-shell min-h-screen bg-gray-100 ${darkMode ? "dark-mode" : ""}`}
    >
      {/* Header */}

      <Header />

      <div className="max-w-7xl mx-auto p-6">
        <Dashboard summary={summary} darkMode={darkMode} />

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
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow flex items-center gap-2 cursor-pointer transition"
            >
              <ArrowClockwise24Filled fontSize={26} />
              Reset
            </button>

            {/* <button
              onClick={() => {
                setEditingId(null);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow flex items-center gap-2 cursor-pointer transition"
            >
              <Plus size={18} />
              Add Test Case
            </button> */}

            <button
              onClick={() => {
                setEditingId(null);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow flex items-center gap-2 cursor-pointer transition"
            >
              <AddCircle24Filled fontSize={26} />
              Add Test Case
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
          onCreateBug={createBug}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
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

      <button
        type="button"
        onClick={() => setDarkMode((enabled) => !enabled)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-gray-900 p-4 text-white shadow-xl transition hover:scale-105 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <Sun size={22} /> : <Moon size={22} />}
      </button>

      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-40 rounded-full bg-blue-600 p-4 text-white shadow-xl transition hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUp size={22} />
        </button>
      )}
    </div>
  );
}

export default App;
