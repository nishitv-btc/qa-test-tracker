import * as XLSX from "xlsx";
import { FileUp, FileDown, RotateCcw, Plus } from "lucide-react";
import {
  DocumentArrowUp24Filled,
  DocumentArrowDown24Filled,
  ArrowClockwise24Filled,
  AddCircle24Filled,
} from "@fluentui/react-icons";

function ExportExcel({ testCases }) {
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      testCases.map((tc) => ({
        Module: tc.module,
        "Sub Module": tc.subModule,
        Description: tc.description,
        Status: tc.status || "Pending",
        "Execution Date": tc.executionDate || "",
        Comments: tc.comments,
      })),
    );

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 }, // Module
      { wch: 20 }, // Sub Module
      { wch: 45 }, // Description
      { wch: 18 }, // Status
      { wch: 25 }, // Execution Date
      { wch: 50 }, // Comments
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Execution Results");

    XLSX.writeFile(
      workbook,
      `QA_Test_Execution_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  return (
    // <button
    //   onClick={exportExcel}
    //   className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow flex items-center gap-2 cursor-pointer transition"
    // >
    //   <FileUp size={18} />
    //   Export Results
    // </button>

    <button
      onClick={exportExcel}
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow flex items-center gap-2 cursor-pointer transition"
    >
      <DocumentArrowDown24Filled fontSize={26} />
      Export Results
    </button>
  );
}

export default ExportExcel;
