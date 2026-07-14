import { useEffect, useState } from "react";

const defaultForm = {
  tcId: "",
  module: "",
  subModule: "",
  description: "",
  testSteps: "",
  preCondition: "",
  expectedResult: "",
  actualResult: "",
  comments: "",
};

function AddEditModal({ open, onClose, onSave, editingTestCase }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (editingTestCase) {
      setForm({
        tcId: editingTestCase.tcId || "",
        module: editingTestCase.module || "",
        subModule: editingTestCase.subModule || "",
        description: editingTestCase.description || "",
        testSteps: editingTestCase.testSteps || "",
        preCondition: editingTestCase.preCondition || "",
        expectedResult: editingTestCase.expectedResult || "",
        actualResult: editingTestCase.actualResult || "",
        comments: editingTestCase.comments || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingTestCase, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (
      !form.module.trim() ||
      !form.subModule.trim() ||
      !form.description.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}

        <div className="bg-blue-700 text-white px-6 py-4 rounded-t-xl">
          <h2 className="text-xl font-bold">
            {editingTestCase ? "Edit Test Case" : "Add Test Case"}
          </h2>
        </div>

        {/* Body */}

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div>
            <label className="font-semibold">TC ID</label>

            <input
              type="text"
              name="tcId"
              value={form.tcId}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="font-semibold">Module *</label>

            <input
              type="text"
              name="module"
              value={form.module}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="font-semibold">Sub Module *</label>

            <input
              type="text"
              name="subModule"
              value={form.subModule}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="font-semibold">Description *</label>

            <textarea
              rows="3"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="font-semibold">Pre-condition</label>

            <textarea
              rows="3"
              name="preCondition"
              value={form.preCondition}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
            />
          </div>
          <div>
            <label className="font-semibold">Test Case Steps</label>

            <textarea
              rows="5"
              name="testSteps"
              value={form.testSteps}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
            />
          </div>

          <div>
            <label className="font-semibold">Expected Result</label>

            <textarea
              rows="3"
              name="expectedResult"
              value={form.expectedResult}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
            />
          </div>
          <div>
            <label className="font-semibold">Actual Result</label>

            <textarea
              rows="3"
              name="actualResult"
              value={form.actualResult}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-semibold">Comments/Bug ID</label>

              <input
                type="text"
                name="comments"
                value={form.comments}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1"
              />
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 p-6 border-t bg-white shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer transition duration-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditModal;
