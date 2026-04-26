import { JunkNav } from "@/components/JunkNav";
import { HeroCollage } from "@/components/HeroCollage";
import { Transformations } from "@/components/Transformations";
import { JunkFooter } from "@/components/JunkFooter";

const Index = () => (
  <main className="min-h-screen bg-paper text-foreground">
    <JunkNav />
    <HeroCollage />
    <Transformations />
    <JunkFooter />
  </main>
);

export default Index;
