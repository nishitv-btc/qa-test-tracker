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
      return "status-select status-pass bg-green-100 text-green-700 border-green-300";

    case "Fail":
      return "status-select status-fail bg-red-100 text-red-700 border-red-300";

    case "Not Applicable":
      return "status-select status-not-applicable bg-gray-100 text-gray-700 border-gray-300";

    case "Unable to Test":
      return "status-select status-unable bg-yellow-100 text-yellow-700 border-yellow-300";

    default:
      return "status-select status-pending bg-white text-gray-600 border-gray-300";
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

function ResizableHeader({
  columnKey,
  width,
  label,
  children,
  onResizeStart,
  onResize,
  onResizeEnd,
}) {
  return (
    <th className="border p-3 relative" style={{ width }}>
      {children}
      <div
        className="column-resizer"
        onPointerDown={(event) => onResizeStart(event, columnKey)}
        onPointerMove={onResize}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
        role="separator"
        aria-label={`Resize ${label} column`}
      />
    </th>
  );
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
  const [columnWidths, setColumnWidths] = useState({
    tcId: 100,
    module: 140,
    subModule: 160,
    description: 320,
    preCondition: 180,
    testSteps: 280,
    expectedResult: 240,
    actualResult: 220,
    status: 190,
    executionDate: 150,
    comments: 180,
    actions: 120,
  });
  const filterRef = useRef(null);
  const columnChooserRef = useRef(null);
  const resizingRef = useRef(null);
  const columnWidthsRef = useRef({ ...columnWidths });
  const tableRef = useRef(null);
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

  useEffect(() => {
    columnWidthsRef.current = { ...columnWidths };
  }, [columnWidths]);

  const startResizing = (event, key) => {
    event.preventDefault();
    event.stopPropagation();
    resizingRef.current = {
      key,
      lastX: event.clientX,
      tableWidth,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    document.body.classList.add("is-resizing-column");
  };

  const resizeColumn = (event) => {
    const resize = resizingRef.current;
    if (!resize) return;

    const delta = event.clientX - resize.lastX;
    if (!delta) return;

    const currentWidth = columnWidthsRef.current[resize.key];
    const nextWidth = Math.max(80, currentWidth + delta);
    const appliedDelta = nextWidth - currentWidth;
    if (!appliedDelta) return;

    resize.lastX = event.clientX;
    resize.tableWidth += appliedDelta;
    columnWidthsRef.current[resize.key] = nextWidth;

    const column = tableRef.current?.querySelector(
      `col[data-column-key="${resize.key}"]`,
    );
    if (column) column.style.width = `${nextWidth}px`;
    if (tableRef.current)
      tableRef.current.style.width = `${resize.tableWidth}px`;
  };

  const stopResizing = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setColumnWidths({ ...columnWidthsRef.current });
    resizingRef.current = null;
    document.body.classList.remove("is-resizing-column");
  };

  const tableWidth = useMemo(
    () =>
      Object.entries(visibleColumns).reduce(
        (width, [key, isVisible]) =>
          isVisible ? width + columnWidths[key] : width,
        columnWidths.actions,
      ),
    [visibleColumns, columnWidths],
  );

  const headerProps = {
    onResizeStart: startResizing,
    onResize: resizeColumn,
    onResizeEnd: stopResizing,
  };

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
            Column selector
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
        <table
          ref={tableRef}
          className="border-collapse table-fixed"
          style={{ width: tableWidth, minWidth: "100%" }}
        >
          <colgroup>
            {visibleColumns.tcId && (
              <col
                data-column-key="tcId"
                style={{ width: columnWidths.tcId }}
              />
            )}
            {visibleColumns.module && (
              <col
                data-column-key="module"
                style={{ width: columnWidths.module }}
              />
            )}
            {visibleColumns.subModule && (
              <col
                data-column-key="subModule"
                style={{ width: columnWidths.subModule }}
              />
            )}
            {visibleColumns.description && (
              <col
                data-column-key="description"
                style={{ width: columnWidths.description }}
              />
            )}
            {visibleColumns.preCondition && (
              <col
                data-column-key="preCondition"
                style={{ width: columnWidths.preCondition }}
              />
            )}
            {visibleColumns.testSteps && (
              <col
                data-column-key="testSteps"
                style={{ width: columnWidths.testSteps }}
              />
            )}
            {visibleColumns.expectedResult && (
              <col
                data-column-key="expectedResult"
                style={{ width: columnWidths.expectedResult }}
              />
            )}
            {visibleColumns.actualResult && (
              <col
                data-column-key="actualResult"
                style={{ width: columnWidths.actualResult }}
              />
            )}
            {visibleColumns.status && (
              <col
                data-column-key="status"
                style={{ width: columnWidths.status }}
              />
            )}
            {visibleColumns.executionDate && (
              <col
                data-column-key="executionDate"
                style={{ width: columnWidths.executionDate }}
              />
            )}
            {visibleColumns.comments && (
              <col
                data-column-key="comments"
                style={{ width: columnWidths.comments }}
              />
            )}
            <col
              data-column-key="actions"
              style={{ width: columnWidths.actions }}
            />
          </colgroup>
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {visibleColumns.tcId && (
                <ResizableHeader
                  columnKey="tcId"
                  width={columnWidths.tcId}
                  label={columnNames.tcId}
                  {...headerProps}
                >
                  TC ID
                </ResizableHeader>
              )}
              {visibleColumns.module && (
                <ResizableHeader
                  columnKey="module"
                  width={columnWidths.module}
                  label={columnNames.module}
                  {...headerProps}
                >
                  Module
                </ResizableHeader>
              )}
              {visibleColumns.subModule && (
                <ResizableHeader
                  columnKey="subModule"
                  width={columnWidths.subModule}
                  label={columnNames.subModule}
                  {...headerProps}
                >
                  Sub Module
                </ResizableHeader>
              )}
              {visibleColumns.description && (
                <ResizableHeader
                  columnKey="description"
                  width={columnWidths.description}
                  label={columnNames.description}
                  {...headerProps}
                >
                  Description
                </ResizableHeader>
              )}
              {visibleColumns.preCondition && (
                <ResizableHeader
                  columnKey="preCondition"
                  width={columnWidths.preCondition}
                  label={columnNames.preCondition}
                  {...headerProps}
                >
                  Pre-condition
                </ResizableHeader>
              )}
              {visibleColumns.testSteps && (
                <ResizableHeader
                  columnKey="testSteps"
                  width={columnWidths.testSteps}
                  label={columnNames.testSteps}
                  {...headerProps}
                >
                  Test Case Steps
                </ResizableHeader>
              )}
              {visibleColumns.expectedResult && (
                <ResizableHeader
                  columnKey="expectedResult"
                  width={columnWidths.expectedResult}
                  label={columnNames.expectedResult}
                  {...headerProps}
                >
                  Expected Result
                </ResizableHeader>
              )}
              {visibleColumns.actualResult && (
                <ResizableHeader
                  columnKey="actualResult"
                  width={columnWidths.actualResult}
                  label={columnNames.actualResult}
                  {...headerProps}
                >
                  Actual Result
                </ResizableHeader>
              )}
              {visibleColumns.status && (
                <ResizableHeader
                  columnKey="status"
                  width={columnWidths.status}
                  label={columnNames.status}
                  {...headerProps}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-=bold">Status</span>

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
                </ResizableHeader>
              )}
              {visibleColumns.executionDate && (
                <ResizableHeader
                  columnKey="executionDate"
                  width={columnWidths.executionDate}
                  label={columnNames.executionDate}
                  {...headerProps}
                >
                  Execution Date
                </ResizableHeader>
              )}
              {visibleColumns.comments && (
                <ResizableHeader
                  columnKey="comments"
                  width={columnWidths.comments}
                  label={columnNames.comments}
                  {...headerProps}
                >
                  Bug ID / Comments
                </ResizableHeader>
              )}
              <ResizableHeader
                columnKey="actions"
                width={columnWidths.actions}
                label={columnNames.actions}
                {...headerProps}
              >
                Actions
              </ResizableHeader>
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
