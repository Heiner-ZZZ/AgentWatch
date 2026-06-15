import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingHero } from "@/components/marketing/marketing-hero"
import { MarketingFeatures } from "@/components/marketing/marketing-features"
import { MarketingCodeDemo } from "@/components/marketing/marketing-code-demo"
import { MarketingFooter } from "@/components/marketing/marketing-footer"

export default function MarketingPage() {
  return (
    <>
      <MarketingHeader />
      <MarketingHero />
      <MarketingFeatures />
      <MarketingCodeDemo />
      <MarketingFooter />
    </>
  )
}
