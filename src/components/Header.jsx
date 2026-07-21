import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user, keycloak } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow px-6 py-4 flex justify-between items-center">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-blue-600">QA Test Tracker</h1>

        <p className="text-sm text-gray-500">
          Enterprise Test Execution Platform
        </p>
      </div>

      {/* Right */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {user?.firstName?.charAt(0) || user?.username?.charAt(0)}
          </div>

          <div className="text-left">
            <div className="font-semibold">
              {user?.firstName} {user?.lastName}
            </div>

            <div className="text-xs text-gray-500">
              {user?.roles?.find((r) =>
                [
                  "Admin",
                  "QA Lead",
                  "QA Engineer",
                  "Developer",
                  "Viewer",
                ].includes(r),
              )}
            </div>
          </div>
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border">
            <button
              onClick={() =>
                keycloak.logout({
                  redirectUri: window.location.origin,
                })
              }
              className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
