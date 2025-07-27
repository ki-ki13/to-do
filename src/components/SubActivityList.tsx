"use client";
import React, { useState } from "react";
import { MainActivity, SubActivity } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface SubActivityListProps {
  activity: MainActivity;
  onActivityUpdate: (updates: Partial<MainActivity>) => void;
}

export default function SubActivityList({
  activity,
  onActivityUpdate,
}: SubActivityListProps) {
  const [newSubActivityTitle, setNewSubActivityTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const addSubActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubActivityTitle.trim()) return;

    const newSubActivity: SubActivity = {
      id: generateId(),
      title: newSubActivityTitle.trim(),
      completed: false,
      createdAt: new Date(),
    };

    const updateSubActivities = [...activity.subActivities, newSubActivity];
    onActivityUpdate({
      subActivities: updateSubActivities,
      completed: updateSubActivities.every((sub) => sub.completed),
    });

    setNewSubActivityTitle("");
    setShowAddForm(false);
  };

  const toggleSubActivity = (subActivityId: string) => {
    const updatedSubActivities = activity.subActivities.map((sub) =>
      sub.id === subActivityId ? { ...sub, completed: !sub.completed } : sub
    );

    onActivityUpdate({
      subActivities: updatedSubActivities,
      completed: updatedSubActivities.every((sub) => sub.completed),
    });
  };

  const deleteSubActivity = (subActivityId: string) => {
    const updateSubActivities = activity.subActivities.filter(
      (sub) => sub.id !== subActivityId
    );
    onActivityUpdate({
      subActivities: updateSubActivities,
      completed: updateSubActivities.every((sub) => sub.completed),
    });
  };
  return (
    <div className="ml-8 mt-3">
      {/* Sub-activities list */}
      {activity.subActivities.length > 0 && (
        <div className="space-y-2 mb-3">
          {activity.subActivities.map((subActivity) => (
            <div
              key={subActivity.id}
              className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={subActivity.completed}
                  onChange={() => toggleSubActivity(subActivity.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span
                  className={`text-sm ${
                    subActivity.completed
                      ? "line-through text-gray-500"
                      : "text-gray-700"
                  }`}
                >
                  {subActivity.title}
                </span>
              </div>
              <button
                onClick={() => deleteSubActivity(subActivity.id)}
                className="text-red-600 hover:bg-red-100 p-1 rounded text-xs transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add sub-activity form */}
      {showAddForm ? (
        <form onSubmit={addSubActivity} className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSubActivityTitle}
            onChange={(e) => setNewSubActivityTitle(e.target.value)}
            placeholder="Add sub-activity..."
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-black"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAddForm(false);
              setNewSubActivityTitle("");
            }}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="text-sm text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
        >
          + Add sub-activity
        </button>
      )}
    </div>
  );
}
