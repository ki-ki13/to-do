"use client";
import React, { useState } from "react";
import { MainActivity } from "@/lib/types";
import { generateId, getUrgencyColor } from "@/lib/utils";
import SubActivityList from "./SubActivityList";

interface ActivityListProps {
  activities: MainActivity[];
  onActivitiesChange: (activities: MainActivity[]) => void;
}

export default function ActivityList({
  activities,
  onActivitiesChange,
}: ActivityListProps) {
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityUrgency, setNewActivityUrgency] = useState<
    "low" | "medium" | "high"
  >("medium");

  const addActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    const newActivity: MainActivity = {
      id: generateId(),
      title: newActivityTitle.trim(),
      urgency: newActivityUrgency,
      completed: false,
      subActivities: [],
      createdAt: new Date(),
    };

    onActivitiesChange([...activities, newActivity]);
    setNewActivityTitle("");
    setNewActivityUrgency("medium");
  };

  const updateActivity = (
    activityId: string,
    updates: Partial<MainActivity>
  ) => {
    const updatedActivities = activities.map((activity) =>
      activity.id === activityId ? { ...activity, ...updates } : activity
    );
    onActivitiesChange(updatedActivities);
  };

  const deleteActivity = (activityId: string) => {
    const updatedActivities = activities.filter(
      (activity) => activity.id !== activityId
    );
    onActivitiesChange(updatedActivities);
  };

  const toggleActivityComplete = (activityId: string) => {
    const activity = activities.find((a) => a.id === activityId);
    if (!activity) return;

    if (activity.subActivities.length > 0) {
      const newCompleted = !activity.completed;
      const updatedSubActivities = activity.subActivities.map((sub) => ({
        ...sub,
        completed: newCompleted,
      }));

      updateActivity(activityId, {
        completed: newCompleted,
        subActivities: updatedSubActivities,
      });
    } else {
      updateActivity(activityId, { completed: !activity.completed });
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Main Activities</h3>

      {/* Add new activity form */}
      <form onSubmit={addActivity} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={newActivityTitle}
            onChange={(e) => setNewActivityTitle(e.target.value)}
            placeholder="Add a new main activity..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />

          <select
            value={newActivityUrgency}
            onChange={(e) =>
              setNewActivityUrgency(e.target.value as "low" | "medium" | "high")
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Activity
        </button>
      </form>

      {/* Activities list */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No activities yet. Add your first activity above!
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={activity.completed}
                    onChange={() => toggleActivityComplete(activity.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />

                  <span
                    className={`font-medium ${
                      activity.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {activity.title}
                  </span>

                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(
                      activity.urgency
                    )}`}
                  >
                    {activity.urgency} priority
                  </span>
                </div>

                <button
                  onClick={() => deleteActivity(activity.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>

              <SubActivityList
                activity={activity}
                onActivityUpdate={(updates) =>
                  updateActivity(activity.id, updates)
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
