"use client";
import React, { useState, useEffect } from "react";
import GoalSetter from "@/components/GoalSetter";
import ActivityList from "@/components/ActivityList";
import ProgressBar from "@/components/ProgressBar";
import MemeGenerator from "@/components/MemeGenerator";
import { DailyGoal, TodoData } from "@/lib/types";
import { TodoStorage } from "@/lib/storage";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const [todoData, setTodoData] = useState<TodoData>({
    currentGoal: null,
    history: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadedData = TodoStorage.load();

    // Check if current goal is for today, if not move to history
    if (
      loadedData.currentGoal &&
      !TodoStorage.isCurrentGoalToday(loadedData.currentGoal)
    ) {
      const updatedData: TodoData = {
        currentGoal: null,
        history: [loadedData.currentGoal, ...loadedData.history],
      };
      setTodoData(updatedData);
      TodoStorage.save(updatedData);
    } else {
      setTodoData(loadedData);
    }

    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever todoData changes
  useEffect(() => {
    if (isLoaded) {
      TodoStorage.save(todoData);
    }
  }, [todoData, isLoaded]);

  const handleGoalSet = (goal: DailyGoal) => {
    setTodoData((prev) => ({
      ...prev,
      currentGoal: goal,
    }));
  };

  const handleActivitiesChange = (activities: any[]) => {
    if (!todoData.currentGoal) return;

    const updatedGoal = {
      ...todoData.currentGoal,
      activities,
    };

    setTodoData((prev) => ({
      ...prev,
      currentGoal: updatedGoal,
    }));
  };

  const clearTodayData = () => {
    if (todoData.currentGoal) {
      const updatedData: TodoData = {
        currentGoal: null,
        history: [todoData.currentGoal, ...todoData.history],
      };
      setTodoData(updatedData);
    }
  };

  const clearAllData = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all data? This cannot be undone."
    );
    if (confirmed) {
      TodoStorage.clear();
      setTodoData({ currentGoal: null, history: [] });
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your daily goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 shadow-lg border-b-2 border-pink-300">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                ✨ Slay or Nay 💖
              </h1>
              <p className="text-pink-100 mt-1 text-sm sm:text-base">
                {formatDate(new Date())}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {todoData.currentGoal && (
                <button
                  onClick={clearTodayData}
                  className="px-3 sm:px-4 py-2 text-white bg-gradient-to-r from-pink-500 to-purple-500 border-2 border-pink-300 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🌟 Complete Day
                </button>
              )}

              <button
                onClick={clearAllData}
                className="px-3 sm:px-4 py-2 text-white bg-gradient-to-r from-rose-400 to-pink-500 border-2 border-rose-300 rounded-full hover:from-rose-500 hover:to-pink-600 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🗑️ Clear All Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-6">
          {/* Goal Setting Section */}
          <div className="w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-pink-200 p-6">
              <GoalSetter
                onGoalSet={handleGoalSet}
                currentGoal={todoData.currentGoal}
              />
            </div>
          </div>

          {/* Main App Content */}
          <div className="w-full">
            {todoData.currentGoal ? (
              <div className="space-y-6">
                {/* Progress Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-purple-200 p-6">
                  <ProgressBar activities={todoData.currentGoal.activities} />
                </div>

                {/* Activities Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-pink-200 p-6">
                  <ActivityList
                    activities={todoData.currentGoal.activities}
                    onActivitiesChange={handleActivitiesChange}
                  />
                </div>

                {/* Meme Generator Section - Show only if there are activities */}
                {todoData.currentGoal.activities.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-purple-200 p-6">
                    <MemeGenerator goal={todoData.currentGoal} />
                  </div>
                )}
              </div>
            ) : (
              /* Welcome message when no goal is set */
              <div className="text-center py-8 sm:py-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-pink-200">
                <div className="max-w-md mx-auto p-6">
                  <div className="text-4xl sm:text-6xl mb-4">🎯💕</div>
                  <h2 className="text-xl sm:text-2xl font-bold text-pink-700 mb-4">
                    Ready to slay today, queen? 👑
                  </h2>
                  <p className="text-pink-600 mb-6 text-sm sm:text-base">
                    Set your daily goal to start tracking your fabulous
                    activities and earn your adorable end-of-day meme! ✨
                  </p>
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl p-4 text-left">
                    <h3 className="font-semibold text-pink-800 mb-2 text-sm sm:text-base flex items-center gap-1">
                      💖 How it works:
                    </h3>
                    <ul className="text-pink-700 text-xs sm:text-sm space-y-1">
                      <li>✨ Set your main goal for the day</li>
                      <li>🌸 Add cute activities with urgency levels</li>
                      <li>🎀 Break down activities into adorable sub-tasks</li>
                      <li>💕 Track your progress throughout the day</li>
                      <li>🦄 Get a personalized meme based on your results!</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        {todoData.history.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-pink-200 p-4 sm:p-6 mt-8">
            <h3 className="text-lg sm:text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
              📚✨ Previous Goals
            </h3>
            <div className="space-y-3">
              {todoData.history.slice(0, 5).map((goal) => {
                const completedActivities = goal.activities.filter(
                  (a) => a.completed
                ).length;
                const totalActivities = goal.activities.length;
                const completionRate =
                  totalActivities > 0
                    ? (completedActivities / totalActivities) * 100
                    : 0;

                return (
                  <div
                    key={goal.id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl gap-2 sm:gap-0 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-pink-800 text-sm sm:text-base">
                        {goal.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-pink-600">
                        {new Date(goal.createdAt).toLocaleDateString()} •{" "}
                        {completedActivities}/{totalActivities} activities
                        completed
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:text-right sm:gap-1">
                      <div
                        className={`text-sm font-semibold ${
                          completionRate === 100
                            ? "text-green-600"
                            : completionRate >= 70
                            ? "text-purple-600"
                            : completionRate >= 40
                            ? "text-pink-600"
                            : "text-rose-600"
                        }`}
                      >
                        {Math.round(completionRate)}%
                      </div>
                      <div className="w-16 bg-pink-200 rounded-full h-2 shadow-inner">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            completionRate === 100
                              ? "bg-gradient-to-r from-green-400 to-green-500 shadow-sm"
                              : completionRate >= 70
                              ? "bg-gradient-to-r from-purple-400 to-purple-500 shadow-sm"
                              : completionRate >= 40
                              ? "bg-gradient-to-r from-pink-400 to-pink-500 shadow-sm"
                              : "bg-gradient-to-r from-rose-400 to-rose-500 shadow-sm"
                          }`}
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {todoData.history.length > 5 && (
                <p className="text-center text-pink-500 text-sm mt-4 font-medium">
                  ✨ ... and {todoData.history.length - 5} more fabulous goals!
                  💕
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 border-t-2 border-pink-300 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 text-center text-white">
          <p className="text-xs sm:text-sm flex items-center justify-center gap-1 flex-wrap">
            💕 Daily Goal Tracker • Built with Next.js • Data stored locally in
            your browser ✨
          </p>
        </div>
      </footer>
    </div>
  );
}
