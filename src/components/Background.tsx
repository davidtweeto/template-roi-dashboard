import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";

export const Background: React.FC<{ backgroundFile: string }> = ({ backgroundFile }) => {
  const frame = useCurrentFrame();

  const imgOpacity = interpolate(frame, [0, 30], [0, 0.72], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {backgroundFile ? (
        <Img
          src={staticFile(backgroundFile)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imgOpacity,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(10,22,40,0.85) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(56,189,248,0.06) 0%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};
