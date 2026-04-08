export default function PieChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;

  let cumulativeAngle = -Math.PI / 2;

  const filtered = data.filter((d) => d.value > 0);

  const slices = filtered.map((d, i) => {
    const angle = filtered.length === 1 ? 2 * Math.PI - 0.001 : (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumulativeAngle);
    const y1 = cy + r * Math.sin(cumulativeAngle);
    cumulativeAngle += angle;
    const x2 = cx + r * Math.cos(cumulativeAngle);
    const y2 = cy + r * Math.sin(cumulativeAngle);
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
    return { ...d, path };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-md"
      >
        {slices.map((slice, i) => (
          <path key={i} d={slice.path} fill={slice.color} stroke="white" strokeWidth="2" />
        ))}
      </svg>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full max-w-xs">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {slice.label}
            </span>
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 ml-auto">
              {((slice.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
