import * as React from "react";
import { cn } from "@/lib/utils";

function GreenCheckBox({
  label,
  value,
  checked,
  onChange,
  name,
  className,
  // ...props
}) {
  return (
    <label
      className={cn(
        "group flex items-center gap-2 cursor-pointer select-none", // 고정 className
        className, // 부모로부터 넘어온 className
      )}
    >
      <span
        className={cn(
          "w-4.5 h-4.5 border-2 rounded-xs",
          "flex items-center justify-center transition-all duration-200",
          "group-focus-within:ring-2",
          "group-focus-within:ring-brand-mediumgray",
          "group-focus-within:ring-offset-2",
          checked
            ? "border-brand-green bg-brand-green"
            : "border-brand-darkgray bg-white",
        )}
      >
        {checked && (
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>

      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only" // 화면에는 숨기고 키보드 포커스와 접근성은 유지
      />

      <span className="text-sm">{label}</span>
    </label>
  );
}

export { GreenCheckBox };
