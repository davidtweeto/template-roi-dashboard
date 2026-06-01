import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, LAYOUT } from "../constants";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

type FooterProps = {
  tagline: string;
  badge: string;
};

export const Footer: React.FC<FooterProps> = ({ tagline, badge }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  const translateY = interpolate(frame, [0, 22], [16, 0], {
    extrapolateRight: "clamp",
    easing: ease,
  });

  const scanX = interpolate(frame, [20, 55], [-60, 1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });
  const scanOpacity = interpolate(
    frame,
    [20, 24, 51, 55],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: scanX - 280,
          top: LAYOUT.cardTop,
          width: 280,
          height: LAYOUT.cardHeight,
          background: `linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.06) 35%, rgba(56,189,248,0.35) 70%, rgba(56,189,248,0.6) 100%)`,
          opacity: scanOpacity,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: scanX - 3,
          top: LAYOUT.cardTop,
          width: 6,
          height: LAYOUT.cardHeight,
          background: `white`,
          boxShadow: `0 0 22px 8px rgba(56,189,248,0.95), 0 0 55px 18px rgba(56,189,248,0.5), 0 0 100px 30px rgba(56,189,248,0.2)`,
          opacity: scanOpacity,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 56,
          left: 56,
          right: 56,
          opacity,
          transform: `translateY(${translateY}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 500,
            color: COLORS.textSecondary,
            letterSpacing: "0.01em",
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: 0.6,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: COLORS.cyan,
            }}
          />
          <span style={{ fontSize: 18, color: COLORS.textSecondary, letterSpacing: "0.05em" }}>
            {badge}
          </span>
        </div>
      </div>
    </>
  );
};
