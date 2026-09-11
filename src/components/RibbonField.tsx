import { RibbonFieldBackground } from "@designcodeio/threeui/components/RibbonFieldBackground";
import "@designcodeio/threeui/style.css";

export default function RibbonField() {
  return (
    <RibbonFieldBackground
      speed={1.0}
      pointerAmount={1.0}
      smoothing={0.035}
      hue={-20}
      saturation={1.0}
      brightness={1.0}
      opacity={1.0}
    />
  );
}
