import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  retry?: () => void;
}

export default function ErrorDisplay({ message, retry }: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
      {retry && (
        <button
          onClick={retry}
          className="flex items-center gap-2 mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <RefreshCw size={20} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}