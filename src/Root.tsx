import "./index.css";
import { Composition } from "remotion";
import { ROIDashboard, ROIDashboardSchema } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ROIDashboard"
      component={ROIDashboard}
      durationInFrames={360}
      fps={30}
      width={1080}
      height={1080}
      schema={ROIDashboardSchema}
      defaultProps={{
        badge: "AI SCHEDULING",
        header: {
          titleLine1: "AI Scheduling ROI",
          titleLine2: "has 3 layers",
          subtitle: "The value is bigger than labor savings",
        },
        hardROI: {
          title: "Hard ROI",
          subtitle: "Measurable savings",
          kpis: [
            { label: "Overtime", from: 18, to: 11, unit: "%", prefix: "", direction: "down", barMax: 20 },
            { label: "WIP inventory", from: 22, to: 16, unit: "d", prefix: "", direction: "down", barMax: 25 },
            { label: "Throughput", from: 6, to: 12, unit: "%", prefix: "+", direction: "up", barMax: 20 },
            { label: "Utilization", from: 74, to: 83, unit: "%", prefix: "", direction: "up", barMax: 100 },
          ],
          trendLabel: "Throughput trend",
        },
        operationalROI: {
          title: "Operational ROI",
          subtitle: "Day-to-day control",
          bars: [
            { label: "Firefighting", targetFill: 28, direction: "down" },
            { label: "Replanning load", targetFill: 35, direction: "down" },
            { label: "Decision speed", targetFill: 78, direction: "up" },
          ],
          adherenceLabel: "Schedule adherence",
          adherenceFrom: 71,
          adherenceTo: 94,
        },
        strategicROI: {
          title: "Strategic ROI",
          subtitle: "Long-term intelligence",
          kpis: ["Scalability", "Knowledge capture", "Standardization", "Resilience"],
          networkLabel: "Capability network",
        },
        footer: {
          tagline: "Better decisions under real constraints",
          badge: "CONSTRAINT-AWARE",
        },
        backgroundFile: "bg.png",
      }}
    />
  );
};
