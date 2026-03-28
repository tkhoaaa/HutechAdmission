import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  leftIcon,
  size = "md",
  ...props
}) {
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  const wrapperClass = leftIcon ? "relative" : "";
  const inputPaddingLeft = leftIcon ? "pl-10" : "";

  return (
    <div className={wrapperClass}>
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
          {leftIcon}
        </div>
      )}
      <InputPrimitive
        type={type}
        data-slot="input"
        className={cn(
          "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          sizeClasses[size],
          inputPaddingLeft,
          className
        )}
        {...props} />
    </div>
  );
}

export { Input }
