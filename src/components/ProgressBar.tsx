"use clent";

import React from "react";
import { calculateProgress } from "@/lib/utils";
import { MainActivity } from "@/lib/types";

interface ProgressBarProps {
  activities: MainActivity[];
}

export default function ProgressBar({ activities }: ProgressBarProps) {
  const { completedTasks, totalTasks, completionRate } =
    calculateProgress(activities);
  const percentage = Math.round(completionRate * 100);

  if (totalTasks === 0) {
    return (
      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Progress</h3>
        <p className="text-gray-500">
          Add some activities to see your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Progress</h3>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">
          {completedTasks} of {totalTasks} tasks completed
        </span>
        <span className="text-sm font-semibold text-gray-800">
          {percentage}%
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${
            percentage === 100
              ? "bg-green-500"
              : percentage >= 70
              ? "bg-blue-500"
              : percentage >= 40
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-3 text-center">
        {percentage === 100 && (
          <span className="text-green-600 font-semibold">
            🎉 All done! Great job!
          </span>
        )}
        {percentage >= 70 && percentage < 100 && (
          <span className="text-blue-600 font-semibold">
            🔥 Almost there! Keep going!
          </span>
        )}
        {percentage >= 40 && percentage < 70 && (
          <span className="text-yellow-600 font-semibold">
            ⚡ Good progress! Don't stop now!
          </span>
        )}
        {percentage < 40 && percentage > 0 && (
          <span className="text-red-600 font-semibold">
            💪 Time to focus! You can do this!
          </span>
        )}
      </div>
    </div>
  );
}
