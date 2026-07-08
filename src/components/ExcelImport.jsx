import { useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";

function ExcelImport({ setTestCases, resetTrigger }) {
  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (resetTrigger) {
      setFileName("");
      setCount(0);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [resetTrigger]);

  const importExcel = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, {
        type: "binary",
      });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(worksheet);

      const testCases = rows.map((row, index) => ({
        id: row.ID || index + 1,

        module: row.Module || "",

        subModule: row["Sub Module"] || "",

        description: row.Description || "",

        status: row.Status || "",

        executionDate: row["Execution Date"] || "",

        comments: row.Comments || "",
      }));

      setCount(testCases.length);

      setTestCases(testCases);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={importExcel}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current.click()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow cursor-pointer transition duration-200"
      >
        📥 Import Excel
      </button>

      {fileName && (
        <>
          <span className="text-gray-700 font-medium">📄 {fileName}</span>

          <span className="text-green-600 font-semibold">
            ✅ {count} Test Cases Imported
          </span>
        </>
      )}
    </div>
  );
}

export default ExcelImport;
