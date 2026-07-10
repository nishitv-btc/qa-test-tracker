import { Eraser } from "lucide-react";

function SearchFilter({ search, setSearch, statusFilter, setStatusFilter }) {
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  return (
    <div className="bg-white shadow rounded-xl p-5 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}

        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2">🔍 Search</label>

          <input
            type="text"
            placeholder="Search TC ID, Module, Steps, Status, Bug ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
