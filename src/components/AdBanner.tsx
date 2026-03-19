"use client"

import { useEffect } from "react"

interface AdBannerProps {
  dataAdSlot: string
  dataAdFormat?: string
  dataFullWidthResponsive?: boolean
}

export default function AdBanner({
  dataAdSlot,
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
}: AdBannerProps) {
  useEffect(() => {
    try {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (err: any) {
      console.error("AdSense Error:", err.message)
    }
  }, [])

  return (
    <div className="ad-banner-container w-full flex justify-center items-center my-8 overflow-hidden bg-background/5 border border-border/10 rounded-lg min-h-[90px]">
      <ins
        className="adsbygoogle w-full"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5932974277970825"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  )
}
