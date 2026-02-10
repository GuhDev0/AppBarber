import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    LabelList,
} from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';


type GraficoEmBarraProps = {
    data: any[];
    name: string;
    value: any;
};

    const ordenarDados = (dados: any[], name: string, value: any) => {
        return [...dados].sort((a, b) => b[value] - a[value]);
    }

// #endregion
const TinyBarChart = ({ data, name, value }: GraficoEmBarraProps) => {
    return (
        <ResponsiveContainer width={700} height={170}>
            <BarChart data={ordenarDados(data, name, value)}>
                <XAxis
                    dataKey={name}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={100}
                />

                <YAxis hide />
                <Bar dataKey={value} fill="#8884d8">
                    <LabelList dataKey={value} position="top" />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default TinyBarChart;