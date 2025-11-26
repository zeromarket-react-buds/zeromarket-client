import * as React from "react";
import { cn } from "@/lib/utils";

function GreenRadio({
  label,
  value,
  checked,
  onChange,
  name,
  className,
  ...props
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 cursor-pointer select-none",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
          checked
            ? "border-brand-green bg-brand-green"
            : "border-brand-darkgray"
        )}
      >
        {checked && <span className="w-2.5 h-2.5 bg-white rounded-full"></span>}
      </span>

      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="hidden"
      />

      <span className="text-sm">{label}</span>
    </label>
  );
}

export { GreenRadio };
