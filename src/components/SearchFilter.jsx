function SearchFilter({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
}) {
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSortOrder("asc");
  };

  return (
    <div className="bg-white shadow rounded-xl p-5 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}

        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2">🔍 Search</label>

          <input
            type="text"
            placeholder="Search Module, Sub Module or Description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Status Filter */}

        <div className="w-full lg:w-56">
          <label className="block text-sm font-semibold mb-2">📋 Status</label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
            <option value="Not Applicable">Not Applicable</option>
            <option value="Unable to Test">Unable to Test</option>
            <option value="">Pending</option>
          </select>
        </div>

        {/* Sort */}

        <div className="w-full lg:w-56">
          <label className="block text-sm font-semibold mb-2">
            ↕️ Sort Module
          </label>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>

        {/* Clear Button */}

        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full lg:w-auto bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition cursor-pointer"
          >
            🧹 Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
