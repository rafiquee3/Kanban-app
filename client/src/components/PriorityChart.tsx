'use client';

import { Card, DonutChart, Title, Legend } from '@tremor/react';
import { useTaskStats } from '@/hooks/useTaskStats';

export function PriorityChart() {
  const { data: stats } = useTaskStats();
  
  // Map and sort data to ensure colors match labels (HIGH, MEDIUM, LOW)
  const priorityOrder = ['HIGH', 'MEDIUM', 'LOW'];
  const chartData = (stats?.byPriority || []).sort((a, b) => 
    priorityOrder.indexOf(a.name) - priorityOrder.indexOf(b.name)
  );

  console.log('dataChart Sorted', chartData)

  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="hidden 
        bg-rose-500 bg-yellow-500 bg-blue-500 bg-slate-500 bg-emerald-500
        text-rose-500 text-yellow-500 text-blue-500 text-slate-500 text-emerald-500
        fill-rose-500 fill-yellow-500 fill-blue-500 fill-slate-500 fill-emerald-500
        stroke-rose-500 stroke-yellow-500 stroke-blue-500 stroke-slate-500 stroke-emerald-500
        border-rose-500 border-yellow-500 border-blue-500 border-slate-500 border-emerald-500
        decoration-rose-500 decoration-yellow-500 decoration-blue-500 decoration-slate-500 decoration-emerald-500
      " />
      <Title className="text-slate-700 font-semibold mb-2">Priority Distribution</Title>
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <DonutChart
          className="h-52"
          data={chartData}
          category="value"
          index="name"
          colors={['rose', 'yellow', 'blue']}
          showAnimation={true}
          variant="donut"
        />
        <Legend
          className="mt-6"
          categories={['High', 'Medium', 'Low']}
          colors={['rose', 'yellow', 'blue']}
        />
      </div>
    </Card>
  );
}