"use client";
import React, { useState, useRef, useEffect } from "react";
import { DailyGoal, MemeData } from "@/lib/types";
import { AIMemeGenerator } from "@/lib/memeAIGenerator";
import { calculateProgress } from "@/lib/utils";

interface MemeGeneratorProps {
  goal: DailyGoal;
}

interface MemeResult {
  imageUrl?: string;
  canvas?: HTMLCanvasElement;
  memeData: MemeData;
  method: string;
}

export default function MemeGenerator({ goal }: MemeGeneratorProps) {
  const [memeResult, setMemeResult] = useState<MemeResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { completedTasks, totalTasks } = calculateProgress(goal.activities);

  // Effect to handle canvas drawing when memeResult changes
  useEffect(() => {
    if (memeResult?.canvas && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        canvasRef.current.width = memeResult.canvas.width;
        canvasRef.current.height = memeResult.canvas.height;
        ctx.drawImage(memeResult.canvas, 0, 0);
      }
    }
  }, [memeResult]);

  const generateMeme = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Use the new streamlined method
      const result = await AIMemeGenerator.generateVariedMeme(
        completedTasks,
        totalTasks,
        goal
      );

      // Convert the result to match your existing interface
      const memeResult: MemeResult = {
        imageUrl: result.imageUrl,
        canvas: result.canvas,
        memeData: result.memeData,
        method: result.canvas ? "canvas" : "imgflip",
      };

      setMemeResult(memeResult);
    } catch (error) {
      console.error("Error generating meme:", error);
      const errorMessage =
        (error as Error).message ||
        "Failed to generate meme. Please try again.";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadMeme = () => {
    if (memeResult?.imageUrl) {
      // Download from URL
      const link = document.createElement("a");
      link.download = `daily-meme-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = memeResult.imageUrl;
      link.click();
    } else if (canvasRef.current) {
      // Download from canvas
      const link = document.createElement("a");
      link.download = `daily-meme-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const shareMeme = async () => {
    if (navigator.share) {
      try {
        if (memeResult?.imageUrl) {
          await navigator.share({
            title: `My Daily Progress - ${goal.title}`,
            text: `Check out my productivity meme! ${completedTasks}/${totalTasks} tasks completed.`,
            url: memeResult.imageUrl,
          });
        } else if (canvasRef.current) {
          canvasRef.current.toBlob(async (blob) => {
            if (blob) {
              const file = new File([blob], "meme.png", { type: "image/png" });
              await navigator.share({
                files: [file],
                title: `My Daily Progress - ${goal.title}`,
                text: `${completedTasks}/${totalTasks} tasks completed!`,
              });
            }
          });
        }
      } catch (error) {
        console.error("Error sharing meme:", error);
        downloadMeme(); // Fallback to download
      }
    } else {
      downloadMeme(); // Fallback if sharing not supported
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        End of Day Meme 🎭
      </h3>

      {/* Simplified Description */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>🎪 Varied Meme Generation:</strong> Our AI automatically picks
          the best method for maximum variety! You&apos;ll get different meme
          styles each time - canvas art, popular templates, or AI-generated
          content.
        </p>
      </div>

      <div className="text-center">
        {!memeResult ? (
          <div>
            <p className="text-gray-600 mb-4">
              Ready to see how your day went? Generate your personalized meme!
            </p>
            <button
              onClick={generateMeme}
              disabled={isGenerating}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isGenerating
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Meme...
                </span>
              ) : (
                "Generate My Meme 🎪"
              )}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              {memeResult.imageUrl ? (
                <img
                  src={memeResult.imageUrl}
                  alt="Generated meme"
                  className="max-w-full h-auto border border-gray-300 rounded-lg shadow-sm mx-auto"
                  style={{ maxHeight: "500px" }}
                />
              ) : (
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border border-gray-300 rounded-lg shadow-sm mx-auto"
                />
              )}
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p>
                  <strong>Method:</strong> {memeResult.method}
                </p>
                <p>
                  <strong>Template:</strong> {memeResult.memeData.template}
                </p>
                <p>
                  <strong>Type:</strong> {memeResult.memeData.type}
                </p>
                {memeResult.memeData.isAIGenerated && (
                  <p>
                    <strong>AI Generated:</strong> ✨ Yes
                  </p>
                )}
              </div>

              <div className="flex justify-center gap-3 flex-wrap">
                <button
                  onClick={generateMeme}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center gap-2"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>🔄 New Meme</>
                  )}
                </button>

                <button
                  onClick={downloadMeme}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download
                </button>

                <button
                  onClick={shareMeme}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Generation Error</p>
                <p className="text-sm mt-1">{error}</p>
                <p className="text-xs mt-2 text-red-600">
                  💡 Don&apos;t worry! The system has multiple fallbacks - try
                  again!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API Key Setup Instructions */}
        {!process.env.NEXT_PUBLIC_GROQ_API_KEY && (
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  Setup Required for AI Features
                </p>
                <p className="text-sm mt-1">
                  Add{" "}
                  <code className="bg-yellow-100 px-1 rounded">
                    NEXT_PUBLIC_GROQ_API_KEY
                  </code>{" "}
                  to your environment variables for AI-generated text.
                </p>
                <p className="text-xs mt-2">
                  Get your free API key at{" "}
                  <a
                    href="https://console.groq.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-yellow-800"
                  >
                    console.groq.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Statistics */}
      {totalTasks > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {completedTasks}
              </div>
              <div className="text-xs text-blue-800">Completed</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {totalTasks}
              </div>
              <div className="text-xs text-gray-800">Total Tasks</div>
            </div>
            <div
              className={`p-3 rounded-lg ${
                completedTasks === totalTasks
                  ? "bg-green-50"
                  : completedTasks >= totalTasks * 0.7
                  ? "bg-yellow-50"
                  : "bg-red-50"
              }`}
            >
              <div
                className={`text-2xl font-bold ${
                  completedTasks === totalTasks
                    ? "text-green-600"
                    : completedTasks >= totalTasks * 0.7
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {Math.round((completedTasks / totalTasks) * 100)}%
              </div>
              <div
                className={`text-xs ${
                  completedTasks === totalTasks
                    ? "text-green-800"
                    : completedTasks >= totalTasks * 0.7
                    ? "text-yellow-800"
                    : "text-red-800"
                }`}
              >
                Success Rate
              </div>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                completedTasks === totalTasks
                  ? "bg-gradient-to-r from-green-400 to-green-600"
                  : completedTasks >= totalTasks * 0.7
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                  : "bg-gradient-to-r from-red-400 to-red-600"
              }`}
              style={{
                width: `${(completedTasks / totalTasks) * 100}%`,
                transform: `translateX(0)`,
                animation: "slideIn 1s ease-out",
              }}
            />
          </div>

          {/* Motivational Message */}
          <div className="mt-3 text-center">
            <p
              className={`text-sm font-medium ${
                completedTasks === totalTasks
                  ? "text-green-600"
                  : completedTasks >= totalTasks * 0.7
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {completedTasks === totalTasks
                ? "🎉 Perfect score! You&apos;re crushing it!"
                : completedTasks >= totalTasks * 0.7
                ? "💪 Great progress! Almost there!"
                : "🚀 Room for improvement - you got this tomorrow!"}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
