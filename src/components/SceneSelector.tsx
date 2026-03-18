"use client";

import { SCENES } from "@/lib/prompts";
import type { Scene } from "@/lib/prompts";

interface SceneSelectorProps {
  selected: Scene | null;
  onSelect: (scene: Scene) => void;
}

export default function SceneSelector({ selected, onSelect }: SceneSelectorProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        1. メールのシーンを選択
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SCENES.map((scene) => (
          <button
            key={scene.id}
            onClick={() => onSelect(scene.id)}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:shadow-md ${
              selected === scene.id
                ? "border-blue-500 bg-blue-50 shadow-md dark:border-blue-400 dark:bg-blue-950/30"
                : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
            }`}
          >
            <span className="text-2xl">{scene.icon}</span>
            <span
              className={`text-sm font-medium ${
                selected === scene.id
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {scene.label}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {scene.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
