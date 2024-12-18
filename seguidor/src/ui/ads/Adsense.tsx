"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

type adsenseTypes = {
  pId: string
}

const Adsense = ({ pId }: adsenseTypes) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (document.querySelector('#adsense-script')) {
      setIsScriptLoaded(true);
    }
  }, []);

  if (!pId) {
    console.warn("AdSense public ID is not defined. Skipping AdSense script.");
    return null;
  }

  if (isScriptLoaded) {
    return null; // Evita cargar el script nuevamente si ya está presente
  }

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => setIsScriptLoaded(true)}
    />
  );
};

export default Adsense;
