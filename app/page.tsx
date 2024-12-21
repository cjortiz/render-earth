"use client";
import { LoadingScreen } from "./components/loading";
import { EarthComponent } from "./components/earth";
import { useEffect, useState } from "react";
import { ParticleSample } from "./components/sample-particle";

export default function Page() {
  const [percent, setPercent] = useState<number>(0);
  const [assetLoaded, setAssetLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (percent === 100) {
      const delay = setTimeout(() => {
        setAssetLoaded(true);
      }, 1000); // 1-second delay (1000 milliseconds)

      return () => clearTimeout(delay);
    }
  }, [percent]);

  return (
    <div style={{ background: "black", height: "100vh", position: "relative" }}>
      {/* {!assetLoaded && <LoadingScreen percent={percent} />} */}
      {/* <ParticleSample /> */}
      <EarthComponent
        setAssetLoaded={setAssetLoaded}
        setPercent={setPercent}
        assetLoaded={assetLoaded}
      />
    </div>
  );
}
