import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="w-full text-neutral-500 text-sm h-screen flex items-center justify-center">
      <Loader2 className="animate-spin mr-2" /> <span>redirecting..</span>
    </div>
  );
};

export default loading;
