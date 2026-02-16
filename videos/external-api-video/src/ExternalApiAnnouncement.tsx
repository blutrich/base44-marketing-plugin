import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
  Img,
  staticFile,
  continueRender,
  delayRender,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { loadFont as loadGoogleFont } from "@remotion/google-fonts/Inter";

// Load Google Font (Inter for body)
const { fontFamily: interFont } = loadGoogleFont();

// Load local STKMiso font
const waitForFont = delayRender();
loadFont({
  family: "STKMiso",
  url: staticFile("STKMiso-Regular.ttf"),
  weight: "400",
}).then(() => {
  continueRender(waitForFont);
});

const headingFont = "STKMiso, Inter, sans-serif";

// Base44 Brand Colors (from brands/base44/brand.json)
const COLORS = {
  // Background gradient
  backgroundTop: "#E8F4F8",    // Light blue
  backgroundBottom: "#FDF5F0", // Warm cream

  // Text colors
  text: "#000000",             // Black (primary)
  textSecondary: "#666666",    // Gray (secondary)

  // Accent colors (warm orange)
  accent: "#FF983B",           // Primary orange
  accentLight: "#FFE9DF",      // Light orange
  accentDark: "#EA6020",       // Dark orange

  // UI elements
  cardBg: "#FFFFFF",           // White cards
  codeBg: "#f5f5f5",           // Code blocks
  buttonBg: "#000000",         // Black buttons
  buttonText: "#FFFFFF",       // White button text

  // Code syntax (on light background)
  codeText: "#000000",
  codeKeyword: "#C94001",      // Darkest orange for keywords
  codeString: "#22863a",       // Green for strings
  codeProperty: "#6f42c1",     // Purple for properties
};

// Brand gradient background component
const BrandGradient = ({ children }: { children: React.ReactNode }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, ${COLORS.backgroundTop} 0%, ${COLORS.backgroundBottom} 100%)`,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

// Hook Scene - "Just shipped: External API"
const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const labelY = interpolate(frame, [0, 0.3 * fps], [20, 0], {
    extrapolateRight: "clamp",
  });

  const titleScale = spring({
    frame: frame - 0.4 * fps,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const titleOpacity = interpolate(frame, [0.4 * fps, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <BrandGradient>
      <div style={{ textAlign: "center", padding: 80 }}>
        <div
          style={{
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
            color: COLORS.accent,
            fontSize: 42,
            fontFamily: headingFont,
            fontWeight: 400,
            marginBottom: 24,
          }}
        >
          Just shipped:
        </div>
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            color: COLORS.text,
            fontSize: 96,
            fontFamily: headingFont,
            fontWeight: 400,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          External API
        </div>
      </div>
    </BrandGradient>
  );
};

// Code Scene - Animated code typing
const CodeScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const codeLines = [
    { text: "const response = await fetch(", type: "code" },
    { text: '  "https://app.base44.com/api/..."', type: "string" },
    { text: ");", type: "code" },
    { text: "", type: "empty" },
    { text: "const data = await response.json();", type: "code" },
  ];

  const fullCode = codeLines.map((l) => l.text).join("\n");
  const totalChars = fullCode.length;
  const typingDuration = 6 * fps; // 6 seconds to type
  const charsTyped = Math.floor(
    interpolate(frame, [0, typingDuration], [0, totalChars], {
      extrapolateRight: "clamp",
    })
  );

  const visibleCode = fullCode.slice(0, charsTyped);

  const containerOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Cursor blink
  const cursorOpacity = Math.sin(frame * 0.3) > 0 ? 1 : 0;

  return (
    <BrandGradient>
      <div
        style={{
          opacity: containerOpacity,
          backgroundColor: COLORS.cardBg,
          borderRadius: 24,
          padding: 48,
          width: "85%",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          border: `2px solid ${COLORS.accentLight}`,
        }}
      >
        {/* Window dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#ef4444",
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#eab308",
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
            }}
          />
        </div>

        {/* Code */}
        <pre
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 30,
            lineHeight: 1.6,
            margin: 0,
            color: COLORS.codeText,
            whiteSpace: "pre-wrap",
            backgroundColor: COLORS.codeBg,
            padding: 24,
            borderRadius: 12,
          }}
        >
          {visibleCode}
          <span
            style={{
              opacity: cursorOpacity,
              backgroundColor: COLORS.accent,
              color: COLORS.accent,
            }}
          >
            |
          </span>
        </pre>
      </div>
    </BrandGradient>
  );
};

// Result Scene - JSON response
const ResultScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const responseScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const responseOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const checkmarkScale = spring({
    frame: frame - 1 * fps,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  return (
    <BrandGradient>
      <div
        style={{
          opacity: responseOpacity,
          transform: `scale(${responseScale})`,
          backgroundColor: COLORS.cardBg,
          borderRadius: 24,
          padding: 48,
          width: "80%",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          border: `3px solid ${COLORS.accent}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              transform: `scale(${checkmarkScale})`,
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: COLORS.accent,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 28,
              color: COLORS.buttonText,
            }}
          >
            ✓
          </div>
          <span
            style={{
              color: COLORS.accentDark,
              fontSize: 32,
              fontFamily: interFont,
              fontWeight: 700,
            }}
          >
            200 OK
          </span>
        </div>

        <pre
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 26,
            lineHeight: 1.5,
            margin: 0,
            color: COLORS.codeText,
            backgroundColor: COLORS.codeBg,
            padding: 24,
            borderRadius: 12,
          }}
        >
          <span style={{ color: COLORS.codeProperty }}>{"{"}</span>
          {"\n"}
          {"  "}<span style={{ color: COLORS.codeString }}>"data"</span>:{" "}
          <span style={{ color: COLORS.codeProperty }}>{"["}</span>
          {"\n"}
          {"    "}
          <span style={{ color: COLORS.textSecondary }}>
            {"// Your entities here"}
          </span>
          {"\n"}
          {"  "}<span style={{ color: COLORS.codeProperty }}>{"]"}</span>
          {"\n"}
          <span style={{ color: COLORS.codeProperty }}>{"}"}</span>
        </pre>
      </div>
    </BrandGradient>
  );
};

// CTA Scene
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textOpacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [0, 0.4 * fps], [30, 0], {
    extrapolateRight: "clamp",
  });

  const logoScale = spring({
    frame: frame - 0.6 * fps,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const logoOpacity = interpolate(frame, [0.6 * fps, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <BrandGradient>
      <div style={{ textAlign: "center", padding: 80 }}>
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            color: COLORS.text,
            fontSize: 64,
            fontFamily: headingFont,
            fontWeight: 400,
            textAlign: "center",
            lineHeight: 1.3,
            marginBottom: 48,
          }}
        >
          Connect your apps
          <br />
          <span style={{ color: COLORS.accent }}>to anything.</span>
        </div>

        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{
              height: 80,
              width: "auto",
            }}
          />
        </div>
      </div>
    </BrandGradient>
  );
};

// Main Composition
export const ExternalApiAnnouncement = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.backgroundTop} 0%, ${COLORS.backgroundBottom} 100%)`,
      }}
    >
      {/* Scene 1: Hook (0-3s) */}
      <Sequence from={0} durationInFrames={3 * fps}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Code (3-12s) */}
      <Sequence from={3 * fps} durationInFrames={9 * fps}>
        <CodeScene />
      </Sequence>

      {/* Scene 3: Result (12-17s) */}
      <Sequence from={12 * fps} durationInFrames={5 * fps}>
        <ResultScene />
      </Sequence>

      {/* Scene 4: CTA (17-20s) */}
      <Sequence from={17 * fps} durationInFrames={3 * fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
