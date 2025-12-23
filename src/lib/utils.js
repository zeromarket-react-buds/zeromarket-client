import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = function (...inputs) {
  return twMerge(clsx(inputs));
};

export { cn };
