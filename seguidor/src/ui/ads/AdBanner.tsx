"use client"

import { ADSENSE_PUBLIC_ID } from "@/config/env.config"
import { useEffect } from "react"

type adBannerTypes = {
  dataAdSlot: string,
  dataAdFormat: string,
  dataFullWidthResponsive: boolean
}

const AdBanner = ({ dataAdSlot, dataAdFormat, dataFullWidthResponsive }: adBannerTypes) => {

  useEffect(() => {
    try {
      const adElements = document.querySelectorAll('.adsbygoogle');
      if (adElements.length > 0 && adElements[0].innerHTML === '') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={`ca-pub-${ADSENSE_PUBLIC_ID}`}
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-width-responsive={dataFullWidthResponsive.toString()}
    ></ins>
  )
}

export default AdBanner
