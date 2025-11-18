'use client';

import { Card } from '@/components/ui/card';

type WaterfallChartProps = {
  sanctionAmount: number;
  actualCost: number;
};

export function WaterfallChart({ sanctionAmount, actualCost }: WaterfallChartProps) {
  const difference = actualCost - sanctionAmount;
  const overrunPercentage = ((difference / sanctionAmount) * 100).toFixed(2);
  const isOverrun = difference > 0;

  // Calculate bar heights (as percentages of the max value)
  const maxValue = Math.max(sanctionAmount, actualCost);
  const sanctionHeight = (sanctionAmount / maxValue) * 100;
  const actualHeight = (actualCost / maxValue) * 100;
  const differenceHeight = (Math.abs(difference) / maxValue) * 100;

  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium mb-6">Sanction vs Actual Cost</h3>
      
      <div className="flex items-end justify-around gap-4 h-64 mb-6">
        {/* Sanction Amount Bar */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full flex flex-col justify-end items-center" style={{ height: '100%' }}>
            <div className="text-xs font-medium mb-2">₹{sanctionAmount.toFixed(0)}Cr</div>
            <div
              className="w-full bg-blue-500 rounded-t"
              style={{ height: `${sanctionHeight}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Sanction<br/>Amount
          </div>
        </div>

        {/* Difference Bar */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full flex flex-col justify-end items-center" style={{ height: '100%' }}>
            <div className={`text-xs font-medium mb-2 ${isOverrun ? 'text-red-600' : 'text-green-600'}`}>
              {isOverrun ? '+' : ''}{difference.toFixed(0)}Cr
            </div>
            <div
              className={`w-full rounded-t ${isOverrun ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ height: `${differenceHeight}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            {isOverrun ? 'Overrun' : 'Savings'}<br/>
            ({isOverrun ? '+' : ''}{overrunPercentage}%)
          </div>
        </div>

        {/* Actual Cost Bar */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full flex flex-col justify-end items-center" style={{ height: '100%' }}>
            <div className="text-xs font-medium mb-2">₹{actualCost.toFixed(0)}Cr</div>
            <div
              className={`w-full rounded-t ${isOverrun ? 'bg-red-600' : 'bg-blue-600'}`}
              style={{ height: `${actualHeight}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Actual<br/>Cost
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t text-sm">
        <div>
          <div className="text-muted-foreground">Sanction</div>
          <div className="font-semibold">₹{sanctionAmount.toFixed(2)} Cr</div>
        </div>
        <div>
          <div className={`${isOverrun ? 'text-red-600' : 'text-green-600'}`}>
            {isOverrun ? 'Cost Overrun' : 'Cost Savings'}
          </div>
          <div className={`font-semibold ${isOverrun ? 'text-red-600' : 'text-green-600'}`}>
            {isOverrun ? '+' : ''}₹{difference.toFixed(2)} Cr ({overrunPercentage}%)
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Actual Cost</div>
          <div className="font-semibold">₹{actualCost.toFixed(2)} Cr</div>
        </div>
      </div>
    </Card>
  );
}

