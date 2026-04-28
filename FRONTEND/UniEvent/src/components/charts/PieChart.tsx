import {
  Pie,
  PieChart,
  Sector,
  type PieSectorDataItem,
  Tooltip,
  type TooltipIndex,
  ResponsiveContainer,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Nr. ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`${((percent ?? 1) * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

export default function CustomActiveShapePieChart({
  chartData,
  isAnimationActive = true,
  defaultIndex = undefined,
}: {
  chartData: {name: string, value: number}[];
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
}) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart
          style={{
            aspectRatio: 1,
          }}
          responsive
        >
          <defs>
            <linearGradient
              id="unitaryGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="500"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="var(--color-secondary)" />
              <stop offset="100%" stopColor="var(--color-primary)" />
            </linearGradient>
          </defs>
          <Pie
            activeShape={renderActiveShape}
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="70%"
            fill="url(#unitaryGradient)"
            dataKey="value"
            isAnimationActive={isAnimationActive}
          />
          <Tooltip content={() => null} defaultIndex={defaultIndex} />
          <RechartsDevtools />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
