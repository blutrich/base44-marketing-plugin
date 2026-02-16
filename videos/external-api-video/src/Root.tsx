import { Composition } from "remotion";
import { ExternalApiAnnouncement } from "./ExternalApiAnnouncement";
import { Opus46Announcement } from "./Opus46Announcement";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ExternalApiAnnouncement"
        component={ExternalApiAnnouncement}
        durationInFrames={600} // 20 seconds at 30fps
        fps={30}
        width={1080}
        height={1080} // Square for X
      />
      <Composition
        id="Opus46Announcement"
        component={Opus46Announcement}
        durationInFrames={450} // 15 seconds at 30fps
        fps={30}
        width={1080}
        height={1080} // Square for X
      />
    </>
  );
};
