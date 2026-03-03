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
  url: staticFile("STKMiso-Light.ttf"),
  weight: "300",
}).then(() => {
  loadFont({
    family: "STKMiso",
    url: staticFile("STKMiso-Regular.ttf"),
    weight: "400",
  }).then(() => {
    continueRender(waitForFont);
  });
});

const headingFont = "STKMiso, Inter, sans-serif";
const bodyFont = `${interFont}, sans-serif`;

// Base44 Brand Colors
const COLORS = {
  backgroundTop: "#E8F4F8",
  backgroundBottom: "#FDF5F0",
  text: "#000000",
  textSecondary: "#666666",
  accent: "#FF983B",
  accentLight: "#FFE9DF",
  accentDark: "#EA6020",
  cardBg: "#FFFFFF",
  green: "#22863a",
  red: "#E34850",
};

// Brand gradient background
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

// Scene 1: Logo + "#1 Most Requested" (0-3s)
const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const logoOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const badgeOpacity = interpolate(frame, [0.6 * fps, 1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeY = interpolate(frame, [0.6 * fps, 1 * fps], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <BrandGradient>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            marginBottom: 40,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{ height: 80, width: "auto" }}
          />
        </div>
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            background: COLORS.accentLight,
            color: COLORS.accentDark,
            fontSize: 32,
            fontFamily: headingFont,
            fontWeight: 400,
            padding: "12px 36px",
            borderRadius: 300,
            display: "inline-block",
          }}
        >
          #1 Most Requested Feature
        </div>
      </div>
    </BrandGradient>
  );
};

// Scene 2: "Custom Login" title reveal (3-6s)
const TitleScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  const titleOpacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [0.6 * fps, 1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [0.6 * fps, 1 * fps], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <BrandGradient>
      <div style={{ textAlign: "center", padding: 60 }}>
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            fontSize: 110,
            fontFamily: headingFont,
            fontWeight: 400,
            color: COLORS.text,
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          Custom
          <br />
          <span style={{ color: COLORS.accent }}>Login</span>
        </div>
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            fontSize: 36,
            fontFamily: headingFont,
            fontWeight: 300,
            color: COLORS.textSecondary,
          }}
        >
          Your app now has a front door
        </div>
      </div>
    </BrandGradient>
  );
};

// Scene 3: Pain points (6-10s)
const PainScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pains = [
    { icon: "🔐", text: "Login code is painful" },
    { icon: "🧩", text: "Every page needs protection" },
    { icon: "🏢", text: "Enterprise SSO is another world" },
  ];

  return (
    <BrandGradient>
      <div style={{ padding: 60, width: "100%" }}>
        <div
          style={{
            fontSize: 28,
            fontFamily: headingFont,
            fontWeight: 300,
            color: COLORS.accent,
            textAlign: "center",
            marginBottom: 40,
            opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          Auth is the graveyard of side projects
        </div>
        {pains.map((pain, i) => {
          const delay = 0.4 * fps + i * 0.5 * fps;
          const itemOpacity = interpolate(
            frame,
            [delay, delay + 0.3 * fps],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const itemX = interpolate(
            frame,
            [delay, delay + 0.3 * fps],
            [-30, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                transform: `translateX(${itemX}px)`,
                display: "flex",
                alignItems: "center",
                gap: 20,
                backgroundColor: COLORS.cardBg,
                borderRadius: 16,
                padding: "28px 36px",
                marginBottom: 16,
                marginLeft: 60,
                marginRight: 60,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                border: `2px solid ${COLORS.accentLight}`,
              }}
            >
              <div style={{ fontSize: 40 }}>{pain.icon}</div>
              <div
                style={{
                  fontSize: 36,
                  fontFamily: headingFont,
                  fontWeight: 400,
                  color: COLORS.text,
                }}
              >
                {pain.text}
              </div>
            </div>
          );
        })}
      </div>
    </BrandGradient>
  );
};

// Scene 4: 3 Steps - How it works (10-16s)
const StepsScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { num: "1", title: "Describe your rules", desc: "Tell the AI what you need" },
    { num: "2", title: "AI writes the code", desc: "Login, cookies, RLS" },
    { num: "3", title: "Ship it live", desc: "Protected in minutes" },
  ];

  const headerOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <BrandGradient>
      <div style={{ padding: 60, width: "100%", textAlign: "center" }}>
        <div
          style={{
            opacity: headerOpacity,
            fontSize: 52,
            fontFamily: headingFont,
            fontWeight: 400,
            color: COLORS.text,
            marginBottom: 48,
          }}
        >
          Three steps. <span style={{ color: COLORS.accent }}>No code.</span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            padding: "0 40px",
          }}
        >
          {steps.map((step, i) => {
            const delay = 0.5 * fps + i * 0.6 * fps;
            const cardScale = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 100 },
            });
            const cardOpacity = interpolate(
              frame,
              [delay, delay + 0.3 * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `scale(${cardScale})`,
                  flex: 1,
                  backgroundColor: COLORS.cardBg,
                  borderRadius: 20,
                  padding: "40px 24px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  border: `2px solid ${COLORS.accentLight}`,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: COLORS.text,
                    color: "#fff",
                    fontSize: 28,
                    fontFamily: headingFont,
                    fontWeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontFamily: headingFont,
                    fontWeight: 400,
                    color: COLORS.text,
                    marginBottom: 8,
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontFamily: headingFont,
                    fontWeight: 300,
                    color: COLORS.textSecondary,
                  }}
                >
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BrandGradient>
  );
};

// Scene 5: Key features cards (16-22s)
const FeaturesScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { tag: "AI-Powered", title: "AI writes the login code" },
    { tag: "Security", title: "Row-Level Security built in" },
    { tag: "Granular", title: "Page-level access control" },
    { tag: "Enterprise", title: "SSO when you need it" },
  ];

  const headerOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <BrandGradient>
      <div style={{ padding: 60, width: "100%" }}>
        <div
          style={{
            opacity: headerOpacity,
            fontSize: 48,
            fontFamily: headingFont,
            fontWeight: 400,
            color: COLORS.text,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          Auth that <span style={{ color: COLORS.accent }}>actually works</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            padding: "0 40px",
          }}
        >
          {features.map((feat, i) => {
            const delay = 0.4 * fps + i * 0.35 * fps;
            const cardOpacity = interpolate(
              frame,
              [delay, delay + 0.3 * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const cardY = interpolate(
              frame,
              [delay, delay + 0.3 * fps],
              [20, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `translateY(${cardY}px)`,
                  backgroundColor: COLORS.cardBg,
                  borderRadius: 16,
                  padding: "32px 28px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  border: `2px solid ${COLORS.accentLight}`,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: "rgba(255,152,59,0.12)",
                    color: COLORS.accentDark,
                    fontSize: 16,
                    fontFamily: headingFont,
                    fontWeight: 400,
                    padding: "4px 14px",
                    borderRadius: 8,
                    marginBottom: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {feat.tag}
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontFamily: headingFont,
                    fontWeight: 400,
                    color: COLORS.text,
                    lineHeight: 1.2,
                  }}
                >
                  {feat.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BrandGradient>
  );
};

// Scene 6: Stats bar (22-25s)
const StatsScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: "28K+", label: "Premium builders waiting" },
    { value: "#1", label: "Most requested feature" },
    { value: "0", label: "Lines of code to write" },
  ];

  return (
    <BrandGradient>
      <div style={{ padding: 60, width: "100%" }}>
        <div
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center",
            padding: "0 40px",
          }}
        >
          {stats.map((stat, i) => {
            const delay = i * 0.4 * fps;
            const scale = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12, stiffness: 80 },
            });
            const opacity = interpolate(
              frame,
              [delay, delay + 0.3 * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  flex: 1,
                  backgroundColor: COLORS.cardBg,
                  borderRadius: 20,
                  padding: "48px 24px",
                  textAlign: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  border: `2px solid ${COLORS.accentLight}`,
                }}
              >
                <div
                  style={{
                    fontSize: 72,
                    fontFamily: headingFont,
                    fontWeight: 400,
                    color: COLORS.accent,
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontFamily: headingFont,
                    fontWeight: 300,
                    color: COLORS.textSecondary,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BrandGradient>
  );
};

// Scene 7: CTA + Logo (25-28s)
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textOpacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [0, 0.4 * fps], [30, 0], {
    extrapolateRight: "clamp",
  });

  const buttonScale = spring({
    frame: frame - 0.5 * fps,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const buttonOpacity = interpolate(frame, [0.5 * fps, 0.7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoScale = spring({
    frame: frame - 1.2 * fps,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const logoOpacity = interpolate(frame, [1.2 * fps, 1.4 * fps], [0, 1], {
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
            fontSize: 64,
            fontFamily: headingFont,
            fontWeight: 400,
            color: COLORS.text,
            lineHeight: 1.15,
            marginBottom: 36,
          }}
        >
          Your app deserves
          <br />a <span style={{ color: COLORS.accent }}>front door</span>
        </div>

        <div
          style={{
            opacity: buttonOpacity,
            transform: `scale(${buttonScale})`,
            display: "inline-block",
            backgroundColor: COLORS.text,
            color: "#fff",
            fontSize: 32,
            fontFamily: headingFont,
            fontWeight: 400,
            padding: "18px 56px",
            borderRadius: 300,
            marginBottom: 48,
          }}
        >
          Start building on Base44
        </div>

        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{ height: 60, width: "auto" }}
          />
        </div>
      </div>
    </BrandGradient>
  );
};

// Main Composition - 28 seconds at 30fps = 840 frames
export const CustomLoginFeature = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.backgroundTop} 0%, ${COLORS.backgroundBottom} 100%)`,
      }}
    >
      {/* Scene 1: Hook - Logo + badge (0-3s) */}
      <Sequence from={0} durationInFrames={3 * fps}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Title - Custom Login (3-6s) */}
      <Sequence from={3 * fps} durationInFrames={3 * fps}>
        <TitleScene />
      </Sequence>

      {/* Scene 3: Pain points (6-10s) */}
      <Sequence from={6 * fps} durationInFrames={4 * fps}>
        <PainScene />
      </Sequence>

      {/* Scene 4: Steps - How it works (10-16s) */}
      <Sequence from={10 * fps} durationInFrames={6 * fps}>
        <StepsScene />
      </Sequence>

      {/* Scene 5: Features grid (16-22s) */}
      <Sequence from={16 * fps} durationInFrames={6 * fps}>
        <FeaturesScene />
      </Sequence>

      {/* Scene 6: Stats (22-25s) */}
      <Sequence from={22 * fps} durationInFrames={3 * fps}>
        <StatsScene />
      </Sequence>

      {/* Scene 7: CTA + Logo (25-28s) */}
      <Sequence from={25 * fps} durationInFrames={3 * fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
