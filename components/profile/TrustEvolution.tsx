type HistoryPoint = {
  trust_index_score?: string;
  created_at?: string;
  timestamp?: string;
  last_updated?: string;
};

type Props = {
  history: HistoryPoint[];
};

function formatDate(date: string) {

  if (!date) return "";

  return new Date(date)
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
}

export default function TrustEvolution({
  history,
}: Props) {

  const validHistory = history
    .map((point) => {

      const rawScore =
        Number(point.trust_index_score || 0);

      return {
        score: rawScore * 100,

        date:
          point.created_at ||
          point.timestamp ||
          point.last_updated ||
          "",
      };
    })
    .filter((p) => !isNaN(p.score));

  if (validHistory.length === 0) {
    return null;
  }

  const current =
    validHistory[validHistory.length - 1];

  const chartLeft = 70;
  const chartRight = 500;
  const chartTop = 25;
  const chartBottom = 260;

  const projected = [
    current.score,
    Math.min(current.score + 2, 100),
    Math.min(current.score + 3.5, 100),
    Math.min(current.score + 4.5, 100),
  ];

  const allScores = [
    ...validHistory.map((p) => p.score),
    ...projected,
  ];

  const max =
    Math.max(...allScores, 100);

  const min =
    Math.min(...allScores, 0);

  const range =
    max - min || 1;

  function getY(score: number) {

    return (
      chartBottom -
      ((score - min) / range) *
        (chartBottom - chartTop)
    );
  }

  const historicalPoints =
    validHistory
      .map((p, index) => {

        const x =
          chartLeft +
          (index /
            Math.max(
              validHistory.length - 1,
              1
            )) *
            (chartRight - chartLeft) *
            0.6;

        const y = getY(p.score);

        return `${x},${y}`;
      })
      .join(" ");

  const currentX =
    chartLeft +
    (chartRight - chartLeft) * 0.6;

  const currentY =
    getY(current.score);

  const projectedPoints =
    projected
      .map((score, index) => {

        const x =
          currentX +
          (index /
            (projected.length - 1)) *
            ((chartRight - chartLeft) * 0.4);

        const y =
          getY(score);

        return `${x},${y}`;
      })
      .join(" ");

  return (

    <div className="w-full">

      <div className="relative w-full h-[238px] max-w-[560px]">

        <svg
          viewBox="0 0 640 360"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >

          {/* AXES */}

          <line
            x1={chartLeft}
            y1={chartBottom}
            x2={chartRight}
            y2={chartBottom}
            stroke="black"
            strokeWidth="1"
          />

          <line
            x1={chartLeft}
            y1={chartTop}
            x2={chartLeft}
            y2={chartBottom}
            stroke="black"
            strokeWidth="1"
          />

          {/* GRID */}

          {[25, 50, 75, 100].map((tick) => {

            const y = getY(tick);

            return (

              <g key={tick}>

                <line
                  x1={chartLeft}
                  y1={y}
                  x2={chartRight}
                  y2={y}
                  stroke="rgba(0,0,0,0.12)"
                  strokeWidth="1"
                />

                <text
                  x={12}
                  y={y + 5}
                  fontSize="16"
                  fill="black"
                >
                  {tick}
                </text>

              </g>

            );
          })}

          {/* REAL TRAJECTORY */}

          {validHistory.length > 1 && (

            <polyline
              fill="none"
              stroke="black"
              strokeWidth="3"
              points={historicalPoints}
            />

          )}

          {/* PROJECTED */}

          <polyline
            fill="none"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="2"
            strokeDasharray="6 6"
            points={projectedPoints}
          />

          {/* GUIDE LINES */}

          <line
            x1={currentX}
            y1={currentY}
            x2={currentX}
            y2={chartBottom}
            stroke="black"
            strokeWidth="1"
          />

          <line
            x1={chartLeft}
            y1={currentY}
            x2={currentX}
            y2={currentY}
            stroke="black"
            strokeWidth="1"
          />

          {/* CURRENT NODE */}

          <circle
            cx={currentX}
            cy={currentY}
            r="6"
            fill="#0ed400"
          />

          {/* SCORE */}

          <text
            x={currentX + 12}
            y={currentY - 10}
            fontSize="18"
            fill="black"
          >
            {Math.round(current.score)}
          </text>

          {/* DATE */}

          <text
            x={currentX - 25}
            y={290}
            fontSize="18"
            fill="black"
          >
            {formatDate(current.date)}
          </text>

        </svg>

      </div>

      <div className="-mt-7 flex">

  <div className="border border-black/10 px-4 py-2 text-sm text-black/55 inline-flex items-center">

    <span>
      Trajectory derived from historical platform trust evolution patterns.
    </span>

  </div>

</div>

    </div>
  );
}