"use client";

interface AccessibleProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showText?: boolean;
  className?: string;
}

export function AccessibleProgressBar({
  current,
  total,
  label = "Progress",
  showText = true,
  className = "",
}: AccessibleProgressBarProps) {
  const percentage = Math.round((current / total) * 100);
  const progressId = `progress-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground" id={`${progressId}-label`}>
            {label}
          </span>
          <span className="text-sm text-muted-foreground" aria-live="polite">
            {current} of {total} ({percentage}%)
          </span>
        </div>
      )}
      
      <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-labelledby={showText ? `${progressId}-label` : undefined}
          aria-label={!showText ? `${label}: ${current} of ${total}` : undefined}
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <span className="sr-only" aria-live="polite">
        {label}: {current} of {total} completed ({percentage}%)
      </span>
    </div>
  );
}
