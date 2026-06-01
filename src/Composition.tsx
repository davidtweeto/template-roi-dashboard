import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, staticFile } from "remotion";
import { Background } from "./components/Background";
import { Header } from "./components/Header";
import { HardROICard } from "./components/HardROICard";
import { OperationalROICard } from "./components/OperationalROICard";
import { StrategicROICard } from "./components/StrategicROICard";
import { Footer } from "./components/Footer";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "700", "800"] });

const KPISchema = z.object({
  label: z.string(),
  from: z.number(),
  to: z.number(),
  unit: z.string(),
  prefix: z.string(),
  direction: z.enum(["up", "down"]),
  barMax: z.number(),
});

const StabilityBarSchema = z.object({
  label: z.string(),
  targetFill: z.number(),
  direction: z.enum(["up", "down"]),
});

export const ROIDashboardSchema = z.object({
  badge: z.string(),
  header: z.object({
    titleLine1: z.string(),
    titleLine2: z.string(),
    subtitle: z.string(),
  }),
  hardROI: z.object({
    title: z.string(),
    subtitle: z.string(),
    kpis: z.tuple([KPISchema, KPISchema, KPISchema, KPISchema]),
    trendLabel: z.string(),
  }),
  operationalROI: z.object({
    title: z.string(),
    subtitle: z.string(),
    bars: z.tuple([StabilityBarSchema, StabilityBarSchema, StabilityBarSchema]),
    adherenceLabel: z.string(),
    adherenceFrom: z.number(),
    adherenceTo: z.number(),
  }),
  strategicROI: z.object({
    title: z.string(),
    subtitle: z.string(),
    kpis: z.tuple([z.string(), z.string(), z.string(), z.string()]),
    networkLabel: z.string(),
  }),
  footer: z.object({
    tagline: z.string(),
    badge: z.string(),
  }),
  backgroundFile: z.string(),
});

export type ROIDashboardProps = z.infer<typeof ROIDashboardSchema>;

export const ROIDashboard: React.FC<ROIDashboardProps> = (props) => {
  const frame = useCurrentFrame();

  const pulseOpacity = interpolate(
    frame,
    [290, 305, 320],
    [0, 0.06, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const fadeOutOpacity = interpolate(
    frame,
    [330, 358],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a1628", fontFamily }}>
      <Background backgroundFile={props.backgroundFile} />
      <Header
        badge={props.badge}
        titleLine1={props.header.titleLine1}
        titleLine2={props.header.titleLine2}
        subtitle={props.header.subtitle}
      />
      <Sequence from={60}>
        <HardROICard
          title={props.hardROI.title}
          subtitle={props.hardROI.subtitle}
          kpis={props.hardROI.kpis}
          trendLabel={props.hardROI.trendLabel}
        />
      </Sequence>
      <Sequence from={120}>
        <OperationalROICard
          title={props.operationalROI.title}
          subtitle={props.operationalROI.subtitle}
          bars={props.operationalROI.bars}
          adherenceLabel={props.operationalROI.adherenceLabel}
          adherenceFrom={props.operationalROI.adherenceFrom}
          adherenceTo={props.operationalROI.adherenceTo}
        />
      </Sequence>
      <Sequence from={210}>
        <StrategicROICard
          title={props.strategicROI.title}
          subtitle={props.strategicROI.subtitle}
          kpis={props.strategicROI.kpis}
          networkLabel={props.strategicROI.networkLabel}
        />
      </Sequence>
      <Sequence from={270}>
        <Footer tagline={props.footer.tagline} badge={props.footer.badge} />
      </Sequence>
      <AbsoluteFill
        style={{
          backgroundColor: "white",
          opacity: pulseOpacity,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: "#0a1628",
          opacity: fadeOutOpacity,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 3,
          left: 14,
          opacity: 0.25,
          display: "flex",
          alignItems: "center",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        <img src={staticFile("LinkedIn_icon.svg")} style={{ width: 32, height: 32 }} />
        <span
          style={{
            color: "#ffffff",
            fontSize: 32,
            fontWeight: 600,
            fontFamily,
            letterSpacing: "0.05em",
          }}
        >
          tweeto
        </span>
      </div>
    </AbsoluteFill>
  );
};
