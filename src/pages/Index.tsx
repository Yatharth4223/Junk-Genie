import { JunkNav } from "@/components/JunkNav";
import { HeroCollage } from "@/components/HeroCollage";
import { ProcessSteps } from "@/components/ProcessSteps";
import { Transformations } from "@/components/Transformations";
import { Manifesto } from "@/components/Manifesto";
import { CtaReceipt } from "@/components/CtaReceipt";
import { JunkFooter } from "@/components/JunkFooter";

const Index = () => (
  <main className="min-h-screen bg-paper text-foreground">
    <JunkNav />
    <HeroCollage />
    <ProcessSteps />
    <Transformations />
    <Manifesto />
    <CtaReceipt />
    <JunkFooter />
  </main>
);

export default Index;
