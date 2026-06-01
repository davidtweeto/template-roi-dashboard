import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, LAYOUT, CARD_LEFT } from "../constants";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const AlertDot: React.FC<{ frame: number; phaseOffset: number; x: number; y: number; size: number }> = ({
  frame, phaseOffset, x, y, size,
}) => {
  const chaosOpacity =
    frame >= 15 && frame < 48
      ? Math.abs(Math.sin((frame + phaseOffset) * 0.55)) * 0.9
      : 0;
  const fadeOut = interpolate(frame, [44, 58], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = chaosOpacity * fadeOut;

  const freqX = 0.11 + phaseOffset * 0.009;
  const freqY = 0.08 + phaseOffset * 0.007;
  const moveX = Math.sin(frame * freqX + phaseOffset) * 26;
  const moveY = Math.cos(frame * freqY + phaseOffset * 1.6) * 14;

  return (
    <div
      style={{
        position: "absolute",
        left: x + moveX,
        top: y + moveY,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: COLORS.red,
        boxShadow: `0 0 ${size + 2}px ${COLORS.red}`,
        opacity,
      }}
    />
  );
};

const ALERT_DOTS = [
  { x: 18,  y: 444, size: 6,  phase: 0.0 },
  { x: 44,  y: 462, size: 9,  phase: 2.1 },
  { x: 70,  y: 448, size: 5,  phase: 4.5 },
  { x: 92,  y: 470, size: 12, phase: 1.3 },
  { x: 118, y: 455, size: 7,  phase: 3.8 },
  { x: 142, y: 474, size: 5,  phase: 0.7 },
  { x: 164, y: 446, size: 10, phase: 2.9 },
  { x: 188, y: 466, size: 6,  phase: 5.2 },
  { x: 212, y: 452, size: 8,  phase: 1.6 },
  { x: 234, y: 471, size: 5,  phase: 4.0 },
  { x: 255, y: 458, size: 11, phase: 2.5 },
  { x: 275, y: 476, size: 6,  phase: 0.4 },
];

type StabilityBar = {
  label: string;
  targetFill: number;
  direction: "up" | "down";
};

const StabilityBarRow: React.FC<StabilityBar & { frame: number; delay: number }> = ({
  label, targetFill, direction, frame, delay,
}) => {
  const rawFill = interpolate(frame, [delay, delay + 50], [0, targetFill], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const settled = interpolate(frame, [delay + 50, delay + 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const idlePulse = Math.sin(frame * 0.032 + delay * 0.18) * 2 * settled;
  const fill = Math.max(0, rawFill + idlePulse);

  const arrowColor = direction === "down" ? "#f87171" : COLORS.amber;

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
        <span style={{ fontSize: 19, color: COLORS.textSecondary }}>{label}</span>
        <span style={{ fontSize: 16, color: arrowColor, fontWeight: 700 }}>
          {direction === "down" ? "↓ reducing" : "↑ improving"}
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
            width: `${fill}%`,
            backgroundColor: COLORS.amber,
            borderRadius: 4,
            boxShadow: `0 0 8px rgba(245,158,11,0.3)`,
          }}
        />
      </div>
    </div>
  );
};

const AdherenceRow: React.FC<{ label: string; from: number; to: number; frame: number }> = ({
  label, from, to, frame,
}) => {
  const baseValue = interpolate(frame, [55, 100], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const adherenceSettled = interpolate(frame, [100, 116], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const idleNudge = Math.sin(frame * 0.028) * 0.9 * adherenceSettled;
  const value = baseValue + idleNudge;

  const baseBarFill = interpolate(frame, [55, 100], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const barFill = Math.max(0, baseBarFill + idleNudge);

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
        <span style={{ fontSize: 19, color: COLORS.textSecondary }}>{label}</span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.amber,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(value)}% ↑
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
            backgroundColor: COLORS.amber,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
};

type OperationalROICardProps = {
  title: string;
  subtitle: string;
  bars: [StabilityBar, StabilityBar, StabilityBar];
  adherenceLabel: string;
  adherenceFrom: number;
  adherenceTo: number;
};

export const OperationalROICard: React.FC<OperationalROICardProps> = ({
  title, subtitle, bars, adherenceLabel, adherenceFrom, adherenceTo,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 35], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  const translateY = interpolate(frame, [0, 35], [55, 0], {
    extrapolateRight: "clamp",
    easing: ease,
  });

  const headerScale = interpolate(frame, [184, 189, 219], [1, 1.09, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chaosLabelOpacity = interpolate(
    frame,
    [18, 28, 42, 52],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const controlLabelOpacity = interpolate(frame, [52, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const optimizedOpacity = interpolate(frame, [68, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const decisionsOpacity = interpolate(frame, [80, 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const controlSettled  = interpolate(frame, [65, 78],  [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const optimizedSettled = interpolate(frame, [80, 93], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const decisionsSettled = interpolate(frame, [92, 105],[0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hlControl   = Math.abs(Math.sin(frame * 0.038 + 0.0)) * controlSettled;
  const hlOptimized = Math.abs(Math.sin(frame * 0.051 + 2.1)) * optimizedSettled;
  const hlDecisions = Math.abs(Math.sin(frame * 0.043 + 1.4)) * decisionsSettled;

  const shakeX = frame >= 18 && frame < 48
    ? Math.sin(frame * 1.2) * interpolate(frame, [18, 48], [6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: CARD_LEFT.operational,
        top: LAYOUT.cardTop,
        width: LAYOUT.cardWidth,
        height: LAYOUT.cardHeight,
        opacity,
        transform: `translateY(${translateY}px)`,
        backgroundColor: COLORS.cardBg,
        border: `1px solid rgba(245,158,11,0.22)`,
        borderRadius: 16,
        padding: 26,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {ALERT_DOTS.map((d, i) => (
        <AlertDot key={i} frame={frame} phaseOffset={d.phase} x={d.x} y={d.y} size={d.size} />
      ))}

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
            backgroundColor: COLORS.amberDim,
            border: `1px solid rgba(245,158,11,0.25)`,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3" stroke={COLORS.amber} strokeWidth="2" />
            <path
              d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"
              stroke={COLORS.amber}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 21, fontWeight: 700, color: COLORS.textPrimary }}>{title}</div>
          <div style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 1 }}>{subtitle}</div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: COLORS.border, marginBottom: 20 }} />

      {bars.map((bar, i) => (
        <StabilityBarRow key={i} {...bar} frame={frame} delay={50 + i * 8} />
      ))}
      <AdherenceRow label={adherenceLabel} from={adherenceFrom} to={adherenceTo} frame={frame} />

      <div style={{ height: 1, backgroundColor: COLORS.border, marginTop: 8, marginBottom: 14 }} />

      <div style={{ position: "relative", height: 28 }}>
        <div style={{
          position: "absolute", inset: 0,
          opacity: chaosLabelOpacity,
          transform: `translateX(${shakeX}px)`,
          display: "inline-flex", alignItems: "center", gap: 6,
          backgroundColor: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 6, padding: "4px 10px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: COLORS.red, boxShadow: `0 0 4px ${COLORS.red}` }} />
          <span style={{ fontSize: 14, color: COLORS.red, fontWeight: 600 }}>FIREFIGHTING MODE</span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{
            opacity: controlLabelOpacity,
            filter: `brightness(${1 + hlControl * 1.4})`,
            display: "inline-flex", alignItems: "center", gap: 6,
            backgroundColor: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.28)",
            borderRadius: 6, padding: "4px 10px",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: COLORS.amber, boxShadow: `0 0 4px ${COLORS.amber}` }} />
            <span style={{ fontSize: 14, color: COLORS.amber, fontWeight: 600 }}>UNDER CONTROL</span>
          </div>
          <div style={{
            opacity: optimizedOpacity,
            filter: `brightness(${1 + hlOptimized * 1.4})`,
            display: "inline-flex", alignItems: "center", gap: 6,
            backgroundColor: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.28)",
            borderRadius: 6, padding: "4px 10px",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: COLORS.green, boxShadow: `0 0 4px ${COLORS.green}` }} />
            <span style={{ fontSize: 14, color: COLORS.green, fontWeight: 600 }}>OPTIMIZED</span>
          </div>
          <div style={{
            opacity: decisionsOpacity,
            filter: `brightness(${1 + hlDecisions * 1.4})`,
            display: "inline-flex", alignItems: "center", gap: 6,
            backgroundColor: "rgba(56,189,248,0.12)",
            border: "1px solid rgba(56,189,248,0.28)",
            borderRadius: 6, padding: "4px 10px",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: COLORS.cyan, boxShadow: `0 0 4px ${COLORS.cyan}` }} />
            <span style={{ fontSize: 14, color: COLORS.cyan, fontWeight: 600 }}>DECISIONS ↑</span>
          </div>
        </div>
      </div>
    </div>
  );
};
