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

interface MonthlyParticipantsChartProps {
    data: Array<{ month: number; registrations: number; attendance: number }>;
    monthNames: string[];
}

export function MonthlyParticipantsChart({ data, monthNames }: MonthlyParticipantsChartProps) {
    const chartData = data.map(item => ({
        month: monthNames[item.month - 1],
        registrasi: item.registrations,
        kehadiran: item.attendance
    }));

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                    <XAxis 
                        dataKey="month"
                        tick={{ fill: 'currentColor', fontSize: 12 }}
                    />
                    <YAxis 
                        tick={{ fill: 'currentColor', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--background)',
                            borderColor: 'var(--border)',
                            borderRadius: '6px'
                        }}
                        cursor={{ fill: 'var(--primary-foreground)', opacity: 0.1 }}
                    />
                    <Legend />
                    <Bar 
                        dataKey="registrasi" 
                        name="Registrasi" 
                        fill="var(--primary)"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                        dataKey="kehadiran" 
                        name="Kehadiran" 
                        fill="var(--secondary)"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}