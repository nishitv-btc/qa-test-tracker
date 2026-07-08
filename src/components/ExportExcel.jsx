import * as XLSX from "xlsx";

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
    <button
      onClick={exportExcel}
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow cursor-pointer transition duration-200"
    >
      📤 Export Results
    </button>
  );
}

export default ExportExcel;
