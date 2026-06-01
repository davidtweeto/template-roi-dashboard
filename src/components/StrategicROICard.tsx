import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, LAYOUT, CARD_LEFT } from "../constants";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const BASE_NODES = [
  { cx: 22,  cy: 58 },
  { cx: 78,  cy: 22 },
  { cx: 85,  cy: 78 },
  { cx: 140, cy: 42 },
  { cx: 148, cy: 88 },
  { cx: 200, cy: 18 },
  { cx: 210, cy: 68 },
];
const FLOAT_PHASES = [0, 1.1, 2.3, 0.5, 1.9, 0.8, 2.6];
const EDGE_INDICES = [
  [0, 1], [0, 2],
  [1, 3], [2, 3], [2, 4],
  [3, 5], [3, 6], [4, 6],
  [5, 6],
];

const NodeNetwork: React.FC<{ frame: number }> = ({ frame }) => {
  const nodes = BASE_NODES.map((n, i) => {
    const appeared = interpolate(frame, [20 + i * 7, 20 + i * 7 + 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fx = Math.sin(frame * 0.027 + FLOAT_PHASES[i]) * 5 * appeared;
    const fy = Math.cos(frame * 0.019 + FLOAT_PHASES[i] * 1.4) * 4 * appeared;
    return { cx: n.cx + fx, cy: n.cy + fy };
  });

  return (
    <svg width="254" height="104" viewBox="0 0 260 104">
      {EDGE_INDICES.map(([a, b], i) => {
        const drawProgress = interpolate(frame, [20 + i * 6, 20 + i * 6 + 25], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
        });
        const na = nodes[a];
        const nb = nodes[b];
        const lx = na.cx + (nb.cx - na.cx) * drawProgress;
        const ly = na.cy + (nb.cy - na.cy) * drawProgress;
        return (
          <line
            key={i}
            x1={na.cx}
            y1={na.cy}
            x2={lx}
            y2={ly}
            stroke={COLORS.cyan}
            strokeWidth="1.5"
            strokeOpacity="0.38"
          />
        );
      })}
      {nodes.map((n, i) => {
        const nodeOpacity = interpolate(frame, [20 + i * 7, 20 + i * 7 + 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
        });
        const glowPulse = 1 + Math.sin(frame * 0.05 + FLOAT_PHASES[i]) * 0.25;
        return (
          <g key={i} opacity={nodeOpacity}>
            <circle cx={n.cx} cy={n.cy} r={8 * glowPulse} fill={COLORS.cyan} opacity="0.08" />
            <circle cx={n.cx} cy={n.cy} r={5} fill={COLORS.cyanDim} stroke={COLORS.cyan} strokeWidth="1.5" />
          </g>
        );
      })}
    </svg>
  );
};

const KPILabel: React.FC<{
  label: string;
  frame: number;
  delay: number;
  hlFreq: number;
  hlPhase: number;
}> = ({ label, frame, delay, hlFreq, hlPhase }) => {
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const x = interpolate(frame, [delay, delay + 20], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const appeared = interpolate(frame, [delay + 20, delay + 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hl = Math.abs(Math.sin(frame * hlFreq + hlPhase)) * appeared;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        padding: "5px 8px",
        marginLeft: -8,
        borderRadius: 7,
        backgroundColor: `rgba(56,189,248,${hl * 0.13})`,
        borderLeft: `2px solid rgba(56,189,248,${hl * 0.9})`,
        boxSizing: "border-box",
      }}
    >
      <span style={{
        fontSize: 19,
        color: hl > 0.25 ? COLORS.textPrimary : COLORS.textSecondary,
        fontWeight: hl > 0.4 ? 600 : 400,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 17,
        fontWeight: 700,
        color: COLORS.cyan,
        opacity: 0.45 + hl * 0.55,
        textShadow: hl > 0.5 ? `0 0 8px ${COLORS.cyan}` : "none",
      }}>
        ↑
      </span>
    </div>
  );
};

const HL_FREQS  = [0.07,  0.055, 0.09,  0.065];
const HL_PHASES = [0.0,   1.7,   3.1,   2.4  ];

type StrategicROICardProps = {
  title: string;
  subtitle: string;
  kpis: [string, string, string, string];
  networkLabel: string;
};

export const StrategicROICard: React.FC<StrategicROICardProps> = ({ title, subtitle, kpis, networkLabel }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 35], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  const translateY = interpolate(frame, [0, 35], [55, 0], {
    extrapolateRight: "clamp",
    easing: ease,
  });

  const headerScale = interpolate(frame, [100, 105, 135], [1, 1.09, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: CARD_LEFT.strategic,
        top: LAYOUT.cardTop,
        width: LAYOUT.cardWidth,
        height: LAYOUT.cardHeight,
        opacity,
        transform: `translateY(${translateY}px)`,
        backgroundColor: COLORS.cardBg,
        border: `1px solid rgba(56,189,248,0.22)`,
        borderRadius: 16,
        padding: 26,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
          transform: `scale(${headerScale})`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            backgroundColor: COLORS.cyanDim,
            border: `1px solid rgba(56,189,248,0.25)`,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="2.5" fill={COLORS.cyan} />
            <circle cx="3" cy="5" r="2" stroke={COLORS.cyan} strokeWidth="1.2" />
            <circle cx="17" cy="5" r="2" stroke={COLORS.cyan} strokeWidth="1.2" />
            <circle cx="3" cy="15" r="2" stroke={COLORS.cyan} strokeWidth="1.2" />
            <circle cx="17" cy="15" r="2" stroke={COLORS.cyan} strokeWidth="1.2" />
            <line x1="10" y1="10" x2="3" y2="5" stroke={COLORS.cyan} strokeWidth="1" opacity="0.6" />
            <line x1="10" y1="10" x2="17" y2="5" stroke={COLORS.cyan} strokeWidth="1" opacity="0.6" />
            <line x1="10" y1="10" x2="3" y2="15" stroke={COLORS.cyan} strokeWidth="1" opacity="0.6" />
            <line x1="10" y1="10" x2="17" y2="15" stroke={COLORS.cyan} strokeWidth="1" opacity="0.6" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 21, fontWeight: 700, color: COLORS.textPrimary }}>{title}</div>
          <div style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 1 }}>{subtitle}</div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: COLORS.border, marginBottom: 20 }} />

      {kpis.map((label, i) => (
        <KPILabel
          key={i}
          label={label}
          frame={frame}
          delay={20 + i * 10}
          hlFreq={HL_FREQS[i]}
          hlPhase={HL_PHASES[i]}
        />
      ))}

      <div style={{ height: 1, backgroundColor: COLORS.border, marginTop: 2, marginBottom: 14 }} />

      <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 }}>
        {networkLabel}
      </div>
      <NodeNetwork frame={frame} />
    </div>
  );
};
