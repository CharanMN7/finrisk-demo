'use client';

import { Card } from '@/components/ui/card';
import { format, differenceInDays, parseISO } from 'date-fns';

type Milestone = {
  name: string;
  planned_date: string;
  actual_date: string | null;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  delay_days: number;
};

type GanttChartProps = {
  milestones: Milestone[];
};

export function GanttChart({ milestones }: GanttChartProps) {
  if (!milestones || milestones.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground text-center">No milestone data available</p>
      </Card>
    );
  }

  // Find date range
  const allDates = milestones.flatMap((m) => [
    parseISO(m.planned_date),
    m.actual_date ? parseISO(m.actual_date) : null,
  ].filter(Boolean) as Date[]);
  
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  const totalDays = differenceInDays(maxDate, minDate) || 1;

  const getPosition = (date: string) => {
    const d = parseISO(date);
    const days = differenceInDays(d, minDate);
    return (days / totalDays) * 100;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
          <span>{format(minDate, 'MMM yyyy')}</span>
          <span>{format(maxDate, 'MMM yyyy')}</span>
        </div>
        
        {milestones.map((milestone, index) => {
          const plannedPos = getPosition(milestone.planned_date);
          const actualPos = milestone.actual_date ? getPosition(milestone.actual_date) : null;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{milestone.name}</span>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Planned: {format(parseISO(milestone.planned_date), 'MMM dd, yyyy')}</span>
                  {milestone.actual_date && (
                    <span className={milestone.delay_days > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                      Actual: {format(parseISO(milestone.actual_date), 'MMM dd, yyyy')}
                      {milestone.delay_days > 0 && ` (+${milestone.delay_days} days)`}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="relative h-8 bg-muted rounded">
                {/* Planned milestone */}
                <div
                  className="absolute top-0 h-full bg-gray-300 dark:bg-gray-700 rounded"
                  style={{
                    left: `${plannedPos}%`,
                    width: '4px',
                  }}
                  title={`Planned: ${format(parseISO(milestone.planned_date), 'MMM dd, yyyy')}`}
                />
                
                {/* Actual milestone */}
                {actualPos !== null && (
                  <div
                    className={`absolute top-0 h-full rounded ${
                      milestone.delay_days > 0
                        ? 'bg-red-500'
                        : milestone.delay_days < 0
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                    style={{
                      left: `${actualPos}%`,
                      width: '4px',
                    }}
                    title={`Actual: ${format(parseISO(milestone.actual_date!), 'MMM dd, yyyy')}`}
                  />
                )}
                
                {/* Connection line if delayed */}
                {actualPos !== null && milestone.delay_days !== 0 && (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 h-0.5 ${
                      milestone.delay_days > 0 ? 'bg-red-300' : 'bg-green-300'
                    }`}
                    style={{
                      left: `${Math.min(plannedPos, actualPos)}%`,
                      width: `${Math.abs(actualPos - plannedPos)}%`,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
        
        <div className="flex items-center gap-6 pt-4 text-xs text-muted-foreground border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
            <span>Planned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span>On Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span>Early</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span>Delayed</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

