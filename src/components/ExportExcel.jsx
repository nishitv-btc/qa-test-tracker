import * as XLSX from "xlsx";

function ExportExcel({ testCases }) {
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      testCases.map((tc) => ({
        ID: tc.id,
        Module: tc.module,
        "Sub Module": tc.subModule,
        Description: tc.description,
        Status: tc.status,
        Comments: tc.comments,
      })),
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Execution Results");

    XLSX.writeFile(workbook, "QA_Test_Execution.xlsx");
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
