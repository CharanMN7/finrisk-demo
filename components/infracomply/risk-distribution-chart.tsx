'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

type RiskDistributionChartProps = {
  data: Array<{
    name: string;
    value: number;
    exposure: number;
    fill: string;
  }>;
};

export function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  return (
    <>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{data.name}</p>
                      <p className="text-sm">Projects: {data.value}</p>
                      <p className="text-sm">Exposure: ₹{(data.exposure / 100).toFixed(0)}Cr</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <div className="text-2xl font-bold" style={{ color: item.fill }}>
              {item.value}
            </div>
            <div className="text-sm text-muted-foreground">{item.name}</div>
            <div className="text-xs text-muted-foreground">
              ₹{(item.exposure / 100).toFixed(0)}Cr
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

