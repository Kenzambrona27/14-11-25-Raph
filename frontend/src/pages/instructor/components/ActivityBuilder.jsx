import React from "react";

function ActivityBuilder({
  isOpen,
  onClose,
  activityName,
  setActivityName,
  openDateTime,
  setOpenDateTime,
  dueDateTime,
  setDueDateTime,
  timeLimit,
  setTimeLimit,
  title,
  setTitle,
  instructions,
  setInstructions,
  isCreatingActivity,
  onCreateActivity,
  onReset,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 my-8"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Create Activity</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span>29ms</span>
          </div>
        </div>

        <div className="p-6 space-y-8 max-h-[calc(100vh-180px)] overflow-y-auto">
          {/* Step 1: Activity Name */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                1
              </span>
              <h3 className="text-lg font-semibold text-gray-800">
                Enter the name.
              </h3>
            </div>
            <div>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="Activity name*"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            </div>
          </div>

          {/* Step 2: Time Restrictions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                2
              </span>
              <h3 className="text-lg font-semibold text-gray-800">
                Set the time restrictions for your activity.
              </h3>
            </div>
            <div className="space-y-6">
              {/* Open date and time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Open date and time*
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={openDateTime}
                    onChange={(e) => setOpenDateTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This will be the date and time when your students can start the activity.
                </p>
              </div>

              {/* Due date and time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due date and time*
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={dueDateTime}
                    onChange={(e) => setDueDateTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This will be the date and time when your students cannot access the activity anymore.
                </p>
              </div>

              {/* Time limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time limit
                </label>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                >
                  <option>While the activity is still open</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>3 hours</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  This will limit how long your students can take the activity after starting it.
                </p>
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title *"
              className="w-full px-4 py-3 border-0 border-b-2 border-gray-300 rounded-t-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-gray-50"
            />
            <div className="mt-1 h-0.5 bg-blue-500"></div>
            <p className="mt-2 text-xs text-gray-500">*Required</p>
          </div>

          {/* Instructions Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions (optional)
            </label>
            <div className="border border-gray-300 rounded-lg">
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Instructions (optional)"
                rows={8}
                className="w-full px-4 py-3 border-0 rounded-t-lg focus:outline-none text-gray-800 resize-none"
              />
              {/* Formatting Toolbar */}
              <div className="border-t border-gray-200 px-4 py-2 flex items-center gap-2">
                <button
                  className="p-1.5 hover:bg-gray-100 rounded transition"
                  title="Bold"
                >
                  <span className="font-bold text-gray-700 text-sm">B</span>
                </button>
                <button
                  className="p-1.5 hover:bg-gray-100 rounded transition"
                  title="Italic"
                >
                  <span className="italic text-gray-700 text-sm">I</span>
                </button>
                <button
                  className="p-1.5 hover:bg-gray-100 rounded transition"
                  title="Underline"
                >
                  <span className="underline text-gray-700 text-sm">U</span>
                </button>
                <button
                  className="p-1.5 hover:bg-gray-100 rounded transition"
                  title="Bullet List"
                >
                  <svg
                    className="w-4 h-4 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM4 15a1 1 0 100 2h12a1 1 0 100-2H4z" />
                  </svg>
                </button>
                <button
                  className="p-1.5 hover:bg-gray-100 rounded transition"
                  title="Strikethrough"
                >
                  <span className="line-through text-gray-700 text-sm">X</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onReset();
                onClose();
              }}
              className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={onCreateActivity}
              disabled={!activityName || !openDateTime || !dueDateTime || !title || isCreatingActivity}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activityName && openDateTime && dueDateTime && title && !isCreatingActivity
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isCreatingActivity ? "Creating..." : "Create Activity"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityBuilder;
