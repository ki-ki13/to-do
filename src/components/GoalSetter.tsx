"use client";

import React, { useState, useEffect } from "react";
import { DailyGoal } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { TodoStorage } from "@/lib/storage";

interface GoalSetterProps {
  onGoalSet: (goal: DailyGoal) => void;
  currentGoal?: DailyGoal | null;
}

export default function GoalSetter({
  onGoalSet,
  currentGoal,
}: GoalSetterProps) {
  const [title, setTitle] = useState(currentGoal?.title || "");
  const [description, setDescription] = useState(
    currentGoal?.description || ""
  );
  const [isEditing, setIsEditing] = useState(!currentGoal);

  // Reset form when currentGoal changes (including when it becomes null)
  useEffect(() => {
    setTitle(currentGoal?.title || "");
    setDescription(currentGoal?.description || "");
    setIsEditing(!currentGoal);
  }, [currentGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const goal: DailyGoal = currentGoal
      ? {
          ...currentGoal,
          title: title.trim(),
          description: description.trim(),
        }
      : {
          id: generateId(),
          title: title.trim(),
          description: description.trim(),
          date: TodoStorage.getTodayDate(),
          activities: [],
          createdAt: new Date(),
        };

    onGoalSet(goal);
    setIsEditing(false);
  };

  if (!isEditing && currentGoal) {
    return (
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Today&apos;s Goal: {currentGoal.title}
            </h2>
            {currentGoal.description && (
              <p className="text-gray-600">{currentGoal.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {new Date(currentGoal.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-rose-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Edit Goal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {currentGoal ? "Edit Today&apos;s Goal" : "Set Todays Goal"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Goal Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to accomplish today?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about your goal..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-rose-400 to-rose-500 shadow-sm text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {currentGoal ? "Update Goal" : "Set Goal"}
          </button>

          {currentGoal && (
            <button
              type="button"
              onClick={() => {
                setTitle(currentGoal.title);
                setDescription(currentGoal.description || "");
                setIsEditing(false);
              }}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}