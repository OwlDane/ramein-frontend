import { FC } from 'react';
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

interface MonthlyStatsProps {
    data: number[];
    months: string[];
    title: string;
    dataKey: string;
    color: string;
}

export const MonthlyStatsChart: FC<MonthlyStatsProps> = ({
    data,
    months,
    title,
    dataKey,
    color
}) => {
    const chartData = data.map((value, index) => ({
        name: months[index],
        [dataKey]: value
    }));

    return (
        <div className="w-full h-[400px] p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={dataKey} fill={color} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};