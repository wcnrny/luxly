import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero";
import { BentoGridSection } from "@/components/landing/bento-grid";
import { CommunitySection } from "@/components/landing/community";
import { SiteFooter } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <BentoGridSection />
        <CommunitySection />
      </main>
      <SiteFooter />
    </div>
  );
}
