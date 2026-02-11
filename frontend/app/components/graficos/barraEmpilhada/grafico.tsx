'use client';
import { 
  Bar, 
  BarChart, 
  Tooltip, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  LabelList,
  CartesianGrid 
} from 'recharts';

type GraficoEmBarraProps = {
  data: any[];
  name: string;
  value: string;
};

// --- Função para quebrar o texto do Eixo X ---
const CustomizedTick = (props: any) => {
  const { x, y, payload } = props;
  const words = payload.value.split(' '); // Quebra o nome por espaços

  return (
    <g transform={`translate(${x},${y})`}>
      {words.map((word: string, index: number) => (
        <text
          key={index}
          x={0}
          y={index * 14} 
          dy={12}
          textAnchor="middle"
          fill="#a6a6a6"
          fontSize={11}
        >
          {word}
        </text>
      ))}
    </g>
  );
};

// --- Tooltip Visual Dark ---
function CustomTooltip({ payload, label, active }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #333',
          padding: '8px 12px',
          borderRadius: '8px',
        }}>
        <p style={{ margin: '0', fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{label}</p>
        <p style={{ margin: '0', color: '#ff6a00', fontSize: '13px' }}>{`Qtd: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
}

export default function GraficoEmBarraEmpilhada({ data, name, value }: GraficoEmBarraProps) {
  return (
    <ResponsiveContainer width="100%" height="80%">
      <BarChart 
        data={data} 
        margin={{ top: 30, right: 10, left: -20, bottom: 20 }} // Aumentei o bottom para caber as palavras
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
        
        <XAxis
          dataKey={name}
          axisLine={false}
          tickLine={false}
          interval={0} // Força a exibição de todos os nomes
          tick={<CustomizedTick />} // Usa a nossa função de quebra de linha
        />
        
        <YAxis hide domain={[0, 'dataMax + 20']} />
        
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        
        <Bar 
          dataKey={value} 
          fill="#ff6a00" 
          radius={[6, 6, 0, 0]} 
          barSize={40}
        >
          <LabelList 
            dataKey={value} 
            position="top" 
            fill="#fff" 
            fontSize={12} 
            fontWeight="bold"
            offset={10}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}