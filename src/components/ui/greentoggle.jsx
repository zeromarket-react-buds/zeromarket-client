import * as React from "react";
import { cn } from "@/lib/utils";

function GreenToggle({ checked, onChange, className, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-12.5 h-7 rounded-full transition-colors flex items-center p-1 cursor-pointer ",
        checked ? "bg-[#1B6439]" : "bg-[#1B6439]",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "block w-5 h-5 bg-white rounded-full shadow-md transition-transform",
          checked ? "translate-x-5.5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export { GreenToggle };
