import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
