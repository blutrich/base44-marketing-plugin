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
import { useEffect, useState } from "react";

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

// Scene 1: Logo Intro
const LogoScene = () => {
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

  return (
    <BrandGradient>
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{
            height: 120,
            width: "auto",
          }}
        />
      </div>
    </BrandGradient>
  );
};

// Scene 2: "Just shipped:" label
const JustShippedScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const labelY = interpolate(frame, [0, 0.3 * fps], [20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <BrandGradient>
      <div
        style={{
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          color: COLORS.accent,
          fontSize: 56,
          fontFamily: headingFont,
          fontWeight: 400,
        }}
      >
        Just shipped:
      </div>
    </BrandGradient>
  );
};

// Scene 3: Opus 4.6 reveal with big text
const OpusRevealScene = () => {
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

  const subtitleOpacity = interpolate(frame, [0.5 * fps, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [0.5 * fps, 0.8 * fps], [20, 0], {
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
            color: COLORS.text,
            fontSize: 120,
            fontFamily: headingFont,
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Opus 4.6
        </div>
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            color: COLORS.accent,
            fontSize: 48,
            fontFamily: headingFont,
            fontWeight: 400,
          }}
        >
          is here
        </div>
      </div>
    </BrandGradient>
  );
};

// Scene 4: Benefit text
const BenefitScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <BrandGradient>
      <div
        style={{
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
          backgroundColor: COLORS.cardBg,
          borderRadius: 24,
          padding: 60,
          width: "80%",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          border: `3px solid ${COLORS.accentLight}`,
        }}
      >
        <div
          style={{
            color: COLORS.text,
            fontSize: 48,
            fontFamily: headingFont,
            fontWeight: 400,
            lineHeight: 1.4,
          }}
        >
          Smarter builds.
          <br />
          <span style={{ color: COLORS.accent }}>Better code.</span>
          <br />
          Faster shipping.
        </div>
      </div>
    </BrandGradient>
  );
};

// Scene 5: CTA with logo
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
            fontSize: 56,
            fontFamily: headingFont,
            fontWeight: 400,
            marginBottom: 48,
          }}
        >
          Start building now
        </div>

        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
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

// Main Composition - 15 seconds
export const Opus46Announcement = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.backgroundTop} 0%, ${COLORS.backgroundBottom} 100%)`,
      }}
    >
      {/* Scene 1: Logo (0-2s) */}
      <Sequence from={0} durationInFrames={2 * fps}>
        <LogoScene />
      </Sequence>

      {/* Scene 2: Just shipped (2-4s) */}
      <Sequence from={2 * fps} durationInFrames={2 * fps}>
        <JustShippedScene />
      </Sequence>

      {/* Scene 3: Opus 4.6 reveal (4-8s) */}
      <Sequence from={4 * fps} durationInFrames={4 * fps}>
        <OpusRevealScene />
      </Sequence>

      {/* Scene 4: Benefits (8-12s) */}
      <Sequence from={8 * fps} durationInFrames={4 * fps}>
        <BenefitScene />
      </Sequence>

      {/* Scene 5: CTA (12-15s) */}
      <Sequence from={12 * fps} durationInFrames={3 * fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
