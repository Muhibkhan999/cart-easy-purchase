// Simple chart component for basic data visualization
import { ReactNode } from "react";

export interface ChartConfig {
  [key: string]: {
    label?: string;
    color?: string;
  };
}

export interface ChartContainerProps {
  children: ReactNode;
  config: ChartConfig;
  className?: string;
}

export const ChartContainer = ({ children, config, className = "" }: ChartContainerProps) => {
  return (
    <div className={`chart-container ${className}`} data-chart-config={JSON.stringify(config)}>
      {children}
    </div>
  );
};

export const ChartTooltip = ({ children }: { children?: ReactNode }) => {
  return <div className="chart-tooltip">{children}</div>;
};

export const ChartTooltipContent = ({ children }: { children?: ReactNode }) => {
  return <div className="chart-tooltip-content">{children}</div>;
};