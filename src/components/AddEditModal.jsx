import { useEffect, useState } from "react";

const defaultForm = {
  module: "",
  subModule: "",
  description: "",
  status: "",
  comments: "",
};

function AddEditModal({ open, onClose, onSave, editingTestCase }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (editingTestCase) {
      setForm({
        module: editingTestCase.module || "",
        subModule: editingTestCase.subModule || "",
        description: editingTestCase.description || "",
        status: editingTestCase.status || "",
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

    setForm(defaultForm);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        {/* Header */}

        <div className="bg-blue-700 text-white px-6 py-4 rounded-t-xl">
          <h2 className="text-xl font-bold">
            {editingTestCase ? "Edit Test Case" : "Add Test Case"}
          </h2>
        </div>

        {/* Body */}

        <div className="p-6 space-y-5">
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

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-semibold">Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1"
              >
                <option value="">Pending</option>
                <option>Pass</option>
                <option>Fail</option>
                <option>Not Applicable</option>
                <option>Unable to Test</option>
              </select>
            </div>

            <div>
              <label className="font-semibold">Comments</label>

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

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditModal;
