import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "../constants";

type HeaderProps = {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
};

export const Header: React.FC<HeaderProps> = ({ badge, titleLine1, titleLine2, subtitle }) => {
  const frame = useCurrentFrame();

  const ease = Easing.bezier(0.16, 1, 0.3, 1);

  const h1Opacity = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  const h1Y = interpolate(frame, [0, 22], [28, 0], {
    extrapolateRight: "clamp",
    easing: ease,
  });

  const subOpacity = interpolate(frame, [14, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const subY = interpolate(frame, [14, 38], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const badgeOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        left: 56,
        right: 56,
      }}
    >
      <div
        style={{
          opacity: badgeOpacity,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          backgroundColor: "rgba(56,189,248,0.12)",
          border: "1px solid rgba(56,189,248,0.25)",
          borderRadius: 20,
          padding: "5px 14px",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: COLORS.cyan,
            boxShadow: `0 0 6px ${COLORS.cyan}`,
          }}
        />
        <span style={{ fontSize: 20, color: COLORS.cyan, fontWeight: 600, letterSpacing: "0.04em" }}>
          {badge}
        </span>
      </div>

      <div
        style={{
          opacity: h1Opacity,
          transform: `translateY(${h1Y}px)`,
          fontSize: 76,
          fontWeight: 800,
          color: COLORS.textPrimary,
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
        }}
      >
        {titleLine1}<br />
        <span style={{ color: COLORS.cyan }}>{titleLine2}</span>
      </div>

      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          fontSize: 34,
          fontWeight: 400,
          color: '#1e3a5f',
          marginTop: 14,
          letterSpacing: "0.005em",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
