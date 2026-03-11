// client/src/components/StatsBar.tsx
'use client';

import { Card, Metric, Text, Grid, Color } from '@tremor/react';
import { useTaskStats } from '@/hooks/useTaskStats';

export function StatsBar() {
  const { data: stats, isLoading, error } = useTaskStats();

  // Stan ładowania - szkielet (skeleton)
  if (isLoading) {
    return (
      <Grid numItemsLg={1} className="gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl border border-slate-200" />
        ))}
      </Grid>
    );
  }

  // Obsługa błędu
  if (error) return <div className="text-red-500 text-sm">Failed to fetch statistics.</div>;

  // Mapowanie danych ze statusów na czytelne karty
  const statCards = [
    {
      title: 'To Do',
      value: stats?.byStatus?.TODO || 0,
      color: 'slate' as Color,
      description: 'Pending tasks',
    },
    {
      title: 'In Progress',
      value: stats?.byStatus?.IN_PROGRESS || 0,
      color: 'blue' as Color,
      description: 'Active sprints',
    },
    {
      title: 'Done',
      value: stats?.byStatus?.DONE || 0,
      color: 'emerald' as Color,
      description: 'Completed tasks',
    },
  ];

  return (
    <Grid numItemsLg={1} className="gap-4">
      {statCards.map((item) => (
        <Card 
          key={item.title} 
          decoration="left" 
          decorationColor={item.color}
          className="hover:shadow-md transition-shadow py-4"
        >
          <div className="flex justify-between items-center">
            <div>
              <Text className="text-slate-500 font-medium text-xs">{item.title}</Text>
              <Metric className="text-slate-900 font-bold text-xl">{item.value}</Metric>
            </div>
            <Text className="text-[10px] text-slate-400 max-w-[80px] text-right">{item.description}</Text>
          </div>
        </Card>
      ))}
    </Grid>
  );
}