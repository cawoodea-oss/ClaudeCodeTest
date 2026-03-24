"use client";

import { useState, useEffect } from "react";
import Calendar from "./components/Calendar";

const PRIORITY_ORDER = { high: 0, med: 1, low: 2, "": 3 };

const PRIORITY_STYLES = {
  high: { badge: "bg-red-100 text-red-700", btn: "bg-red-500 text-white" },
  med:  { badge: "bg-amber-100 text-amber-700", btn: "bg-amber-400 text-white" },
  low:  { badge: "bg-green-100 text-green-700", btn: "bg-green-500 text-white" },
};

const PRIORITY_LABELS = { high: "High", med: "Med", low: "Low" };

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [openTaskId, setOpenTaskId] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check authentication status via cookie
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      const response = await fetch("/api/auth/check", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.authenticated) {
        setAccessToken("authenticated");
        console.log("✓ User is authenticated with Google Calendar");
      }
    } catch (err) {
      console.error("Error checking auth status:", err);
    }
  }

  async function exchangeCodeForToken(code) {
    try {
      const response = await fetch(`/api/auth/callback?code=${code}`);
      const data = await response.json();

      if (data.success) {
        setAccessToken("authenticated");
        localStorage.setItem("google_access_token", "authenticated");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      console.error("Error exchanging code:", err);
      setError("Failed to authenticate with Google");
    }
  }

  async function handleGoogleLogin() {
    try {
      const response = await fetch("/api/auth/login");
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error("Error getting auth URL:", err);
      setError("Failed to initiate Google login");
    }
  }

  async function handleAddTask(e) {
    e.preventDefault();
    if (!title.trim() || !duration) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      duration: Number(duration),
      date: date,
      priority: "",
    };

    setTasks((prev) => [newTask, ...prev]);

    // Sync to Google Calendar if authenticated
    if (accessToken) {
      try {
        setIsLoading(true);
        console.log("Attempting to sync task to Google Calendar:", newTask);
        const response = await fetch("/api/calendar/create-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task: newTask,
          }),
          credentials: "include",
        });

        const result = await response.json();
        console.log("Calendar API response:", response.status, result);
        
        if (!response.ok) {
          const errorMsg = result.details || result.error;
          setError(`Calendar sync failed: ${errorMsg}`);
          console.error("Calendar sync error:", result);
        } else {
          console.log("✓ Task synced to Google Calendar:", result);
          setError("");
        }
      } catch (err) {
        console.error("Error syncing to calendar:", err);
        setError("Failed to sync task to Google Calendar: " + err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Not authenticated - skipping calendar sync");
    }

    setTitle("");
    setDuration("");
    setDate("");
  }

  function handleSetPriority(id, priority) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t))
    );
    setOpenTaskId(null);
  }

  const sortedTasks = [...tasks].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Calendar</h1>
        <p className="text-gray-500 mb-8">Add tasks and schedule them to your calendar.</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
            <button 
              onClick={() => setError("")}
              className="float-right text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Google Calendar Auth */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
          {accessToken ? (
            <p className="text-sm text-blue-700">✓ Connected to Google Calendar</p>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Connect to Google Calendar
            </button>
          )}
        </div>

        {/* Add Task Form */}
        <form
          onSubmit={handleAddTask}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Write project proposal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              id="duration"
              type="number"
              placeholder="e.g. 30"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Syncing..." : "Add Task"}
          </button>
        </form>

        {/* Task List */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No tasks yet. Add one above.</p>
        ) : (
          <ul className="space-y-3">
            {sortedTasks.map((task) => {
              const isOpen = openTaskId === task.id;
              const ps = task.priority ? PRIORITY_STYLES[task.priority] : null;

              return (
                <li key={task.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Main row */}
                  <button
                    onClick={() => setOpenTaskId(isOpen ? null : task.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {ps && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${ps.badge}`}>
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                      )}
                      <span className="text-gray-900 font-medium truncate">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      {task.date && (
                        <span className="text-xs text-gray-400">
                          {new Date(task.date + "T00:00:00").toLocaleDateString("default", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                      <span className="text-sm text-gray-500">{task.duration} min</span>
                      <span className="text-gray-400 text-xs">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {/* Priority picker */}
                  {isOpen && (
                    <div className="px-5 pb-4 flex items-center gap-2">
                      <span className="text-xs text-gray-500 mr-1">Priority:</span>
                      {["high", "med", "low"].map((p) => (
                        <button
                          key={p}
                          onClick={() => handleSetPriority(task.id, p)}
                          className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors
                            ${task.priority === p
                              ? PRIORITY_STYLES[p].btn
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          {PRIORITY_LABELS[p]}
                        </button>
                      ))}
                      {task.priority && (
                        <button
                          onClick={() => handleSetPriority(task.id, "")}
                          className="text-xs text-gray-400 hover:text-gray-600 ml-1"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Calendar */}
        <Calendar tasks={tasks} />
      </div>
    </main>
  );
}
