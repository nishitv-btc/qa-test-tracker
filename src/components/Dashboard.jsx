function Dashboard({ summary }) {
  const cards = [
    {
      title: "Total",
      value: summary.total,
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-500",
      icon: "📋",
    },
    {
      title: "Passed",
      value: summary.passed,
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-500",
      icon: "",
    },
    {
      title: "Failed",
      value: summary.failed,
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-500",
      icon: "",
    },
    {
      title: "Unable to Test",
      value: summary.na,
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-500",
      icon: "",
    },
    {
      title: "N/A",
      value: summary.unable,
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-500",
      icon: "",
    },
    {
      title: "Pending",
      value: summary.pending,
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-500",
      icon: "⏳",
    },
  ];

  return (
    <div className="mb-8">
      {/* Summary Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.bg} ${card.border} border-l-4 rounded-xl shadow-md p-5 transition-transform hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  {card.title}
                </p>

                <h2 className={`text-3xl font-bold ${card.text}`}>
                  {card.value}
                </h2>
              </div>

              <div className="text-4xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}

      <div className="bg-white rounded-xl shadow-md mt-8 p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Execution Progress</h2>

          <span className="text-lg font-bold text-blue-700">
            {summary.completion}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-6">
          <div
            className="bg-green-500 h-6 rounded-full transition-all duration-500"
            style={{
              width: `${summary.completion}%`,
            }}
          ></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6 text-center">
          <div>
            <p className="text-gray-500 text-sm">Total</p>
            <p className="font-bold text-lg">{summary.total}</p>
          </div>

          <div>
            <p className="text-green-600 text-sm">Passed</p>
            <p className="font-bold text-green-700 text-lg">{summary.passed}</p>
          </div>

          <div>
            <p className="text-red-600 text-sm">Failed</p>
            <p className="font-bold text-red-700 text-lg">{summary.failed}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm">Unable to Test</p>
            <p className="font-bold text-gray-700 text-lg">{summary.na}</p>
          </div>

          <div>
            <p className="text-yellow-600 text-sm">N/A</p>
            <p className="font-bold text-yellow-700 text-lg">
              {summary.unable}
            </p>
          </div>

          <div>
            <p className="text-purple-600 text-sm">Pending</p>
            <p className="font-bold text-purple-700 text-lg">
              {summary.pending}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
