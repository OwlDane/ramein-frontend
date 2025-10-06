import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface MonthlyEventsChartProps {
    data: Array<{ month: number; count: number }>;
    monthNames: string[];
}

export function MonthlyEventsChart({ data, monthNames }: MonthlyEventsChartProps) {
    const chartData = data.map(item => ({
        month: monthNames[item.month - 1],
        jumlah: item.count
    }));

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                    <XAxis 
                        dataKey="month"
                        tick={{ fill: 'hsl(var(--primary))', fontSize: 12 }}
                    />
                    <YAxis 
                        tick={{ fill: 'hsl(var(--primary))', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--background)',
                            borderColor: 'var(--border)',
                            borderRadius: '6px'
                        }}
                        cursor={{ fill: 'var(--primary-foreground)', opacity: 0.1 }}
                    />
                    <Legend 
                        wrapperStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Bar 
                        dataKey="jumlah" 
                        name="Jumlah Event" 
                        fill="var(--primary)"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}