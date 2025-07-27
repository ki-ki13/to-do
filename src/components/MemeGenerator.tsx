"use client";
import React, { useState, useRef, useEffect } from "react";
import { DailyGoal } from "@/lib/types";
import { MemeGenerator as MemeGen } from "@/lib/memeGenerator";
import { calculateProgress } from "@/lib/utils";

interface MemeGeneratorProps {
  goal: DailyGoal;
}

export default function MemeGenerator({ goal }: MemeGeneratorProps) {
  const [memeData, setMemeData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { completedTasks, totalTasks } = calculateProgress(goal.activities);

  const generateMeme = async () => {
    setIsGenerating(true);
    
    try {
      // Generate meme data
      const meme = MemeGen.generateMemeText(completedTasks, totalTasks, goal);
      setMemeData(meme);

      // Create canvas with template image
      const canvas = await MemeGen.createMemeCanvas(meme);
      
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          canvasRef.current.width = canvas.width;
          canvasRef.current.height = canvas.height;
          ctx.drawImage(canvas, 0, 0);
        }
      }
    } catch (error) {
      console.error('Error generating meme:', error);
      // Fallback to text-only meme if template fails
      const meme = MemeGen.generateMemeText(completedTasks, totalTasks, goal);
      setMemeData(meme);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadMeme = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `my-daily-meme-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        End of Day Meme 🎭
      </h3>
      
      <div className="text-center">
        {!memeData ? (
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
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isGenerating ? "Generating Meme..." : "Check My Meme 🎪"}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto border border-gray-300 rounded-lg shadow-sm mx-auto"
              />
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600 italic">
                Template: {memeData.template} | Type: {memeData.type}
              </p>
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={generateMeme}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate New Meme"}
                </button>
                <button
                  onClick={downloadMeme}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download Meme
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {totalTasks > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tasks Completed: {completedTasks}</span>
            <span>Total Tasks: {totalTasks}</span>
            <span>
              Success Rate: {Math.round((completedTasks / totalTasks) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}