"use client";

import { useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");

  function handleAddTask(e) {
    e.preventDefault();
    if (!title.trim() || !duration) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      duration: Number(duration),
    };

    setTasks((prev) => [newTask, ...prev]);
    setTitle("");
    setDuration("");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Calendar</h1>
        <p className="text-gray-500 mb-8">Add tasks and schedule them to your calendar.</p>

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

          <div className="mb-6">
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

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add Task
          </button>
        </form>

        {/* Task List */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No tasks yet. Add one above.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between"
              >
                <span className="text-gray-900 font-medium">{task.title}</span>
                <span className="text-sm text-gray-500 ml-4 shrink-0">{task.duration} min</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
