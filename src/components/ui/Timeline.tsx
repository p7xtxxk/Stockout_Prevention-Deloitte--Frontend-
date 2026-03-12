import React from 'react';
import { cn } from '../../utils/formatters';

export type TimelineStatus = 'pending' | 'active' | 'completed';

export interface TimelineStep {
  label: string;
  status: TimelineStatus;
  date?: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const Timeline = ({ steps, className }: TimelineProps) => {
  return (
    <div className={cn("flex items-center w-full", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCompleted = step.status === 'completed';
        const isActive = step.status === 'active';
        
        return (
          <React.Fragment key={index}>
            {/* Step Circle & Label */}
            <div className="relative flex flex-col items-center">
              <div 
                className={cn(
                  "w-4 h-4 rounded-full border-2 z-10 bg-white transition-colors duration-300",
                  isCompleted ? "border-primary-600 bg-primary-600" : 
                  isActive ? "border-primary-600 shadow-[0_0_0_3px_rgba(90,110,240,0.15)]" : 
                  "border-slate-300"
                )}
              />
              <div className="absolute top-6 w-24 text-center">
                <p className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  isCompleted || isActive ? "text-slate-900" : "text-slate-400"
                )}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-[10px] text-slate-500 mt-0.5">{step.date}</p>
                )}
              </div>
            </div>

            {/* Connecting Line */}
            {!isLast && (
              <div className="flex-1 h-0.5 mx-2 bg-slate-200">
                <div 
                  className={cn(
                    "h-full bg-primary-600 transition-all duration-500",
                    isCompleted ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
