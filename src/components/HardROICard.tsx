import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, LAYOUT, CARD_LEFT } from "../constants";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

type KPI = {
  label: string;
  from: number;
  to: number;
  unit: string;
  prefix: string;
  direction: "up" | "down";
  barMax: number;
};

const KPIRow: React.FC<KPI & { frame: number; delay: number }> = ({
  label, from, to, unit, prefix, direction, barMax, frame, delay,
}) => {
  const progress = interpolate(frame, [delay, delay + 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const value = from + (to - from) * progress;

  const settled = interpolate(frame, [delay + 45, delay + 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const idlePulse = Math.sin(frame * 0.038 + delay * 0.22) * 2.5 * settled;
  const barFill = Math.max(0, (Math.abs(to) / barMax) * progress * 100 + idlePulse);

  const arrowColor = direction === "down" ? "#f87171" : COLORS.green;

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 7,
        }}
      >
        <span style={{ fontSize: 19, color: COLORS.textSecondary, fontWeight: 400 }}>
          {label}
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.green,
            fontVariantNumeric: "tabular-nums",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {prefix}
          {Math.round(value)}
          {unit}
          <span style={{ color: arrowColor, fontSize: 17 }}>
            {direction === "down" ? " ↓" : " ↑"}
          </span>
        </span>
      </div>
      <div
        style={{
          height: 9,
          backgroundColor: "rgba(255,255,255,0.07)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${barFill}%`,
            backgroundColor: COLORS.green,
            borderRadius: 4,
            boxShadow: `0 0 8px ${COLORS.greenGlow}`,
          }}
        />
      </div>
    </div>
  );
};

const HL_FREQS  = [0.032, 0.042, 0.026, 0.048, 0.036];
const HL_PHASES = [0.0,   1.3,   2.7,   1.8,   3.5  ];

const MiniBarChart: React.FC<{ frame: number }> = ({ frame }) => {
  const bars = [
    { from: 0.2, to: 0.72, delay: 20 },
    { from: 0.25, to: 0.88, delay: 28 },
    { from: 0.2, to: 1.0,  delay: 36 },
    { from: 0.3, to: 0.82, delay: 44 },
    { from: 0.15, to: 0.94, delay: 52 },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 5,
        height: 72,
        paddingTop: 8,
      }}
    >
      {bars.map((b, i) => {
        const settled = interpolate(frame, [b.delay + 40, b.delay + 55], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const idle = Math.sin(frame * 0.045 + i * 1.1) * 0.08 * settled;
        const h = Math.min(1, Math.max(0,
          interpolate(frame, [b.delay, b.delay + 40], [b.from, b.to], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }) + idle
        ));
        const hl = Math.abs(Math.sin(frame * HL_FREQS[i] + HL_PHASES[i])) * settled;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h * 100}%`,
              backgroundColor: COLORS.green,
              borderRadius: 3,
              opacity: 0.7 + i * 0.06,
              filter: `brightness(${1 + hl * 1.4})`,
            }}
          />
        );
      })}
    </div>
  );
};

type HardROICardProps = {
  title: string;
  subtitle: string;
  kpis: [KPI, KPI, KPI, KPI];
  trendLabel: string;
};

export const HardROICard: React.FC<HardROICardProps> = ({ title, subtitle, kpis, trendLabel }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 35], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  const translateY = interpolate(frame, [0, 35], [55, 0], {
    extrapolateRight: "clamp",
    easing: ease,
  });

  const headerScale = interpolate(frame, [237, 242, 272], [1, 1.09, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: CARD_LEFT.hard,
        top: LAYOUT.cardTop,
        width: LAYOUT.cardWidth,
        height: LAYOUT.cardHeight,
        opacity,
        transform: `translateY(${translateY}px)`,
        backgroundColor: COLORS.cardBg,
        border: `1px solid rgba(34,197,94,0.22)`,
        borderRadius: 16,
        padding: 26,
        boxSizing: "border-box",
        backdropFilter: "blur(8px)",
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
            backgroundColor: COLORS.greenDim,
            border: `1px solid rgba(34,197,94,0.25)`,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="10" width="3" height="8" rx="1" fill={COLORS.green} opacity="0.7" />
            <rect x="7" y="6" width="3" height="12" rx="1" fill={COLORS.green} opacity="0.85" />
            <rect x="12" y="2" width="3" height="16" rx="1" fill={COLORS.green} />
            <path d="M2 10 L7 6 L12 2" stroke={COLORS.green} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 21, fontWeight: 700, color: COLORS.textPrimary }}>{title}</div>
          <div style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 1 }}>{subtitle}</div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: COLORS.border, marginBottom: 22 }} />

      {kpis.map((kpi, i) => (
        <KPIRow key={i} {...kpi} frame={frame} delay={22 + i * 8} />
      ))}

      <div style={{ height: 1, backgroundColor: COLORS.border, marginTop: 12, marginBottom: 20 }} />

      <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 }}>{trendLabel}</div>
      <MiniBarChart frame={frame} />
    </div>
  );
};
