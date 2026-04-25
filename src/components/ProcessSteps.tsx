import { Camera, Brain, Hammer } from "lucide-react";

const steps = [
  { n: "01", icon: Camera, title: "Point & Shoot", note: "snap that mess", body: "Open the scanner, aim at your pile of garage chaos. We see every can, plank and broken thingamajig.", color: "bg-caution", rot: "r-l2" },
  { n: "02", icon: Brain, title: "Genie Thinks", note: "magic happens", body: "Our AI matches your materials with thousands of project ideas — filtered by skill, time and how weird you want to get.", color: "bg-paper", rot: "r-r1" },
  { n: "03", icon: Hammer, title: "Build It", note: "go forth & make", body: "Get a step-by-step plan, tool list and a render of what you're making. Then actually finish a project for once.", color: "bg-rust text-paper", rot: "r-l1" },
];

export const ProcessSteps = () => (
  <section id="process" className="relative kraft border-y-2 border-ink py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="flex flex-col items-center mb-16">
        <span className="font-mono uppercase text-xs tracking-[0.4em] bg-ink text-paper px-3 py-1 mb-4">// the process</span>
        <h2 className="font-display text-5xl md:text-7xl text-center leading-none">
          Three steps. <span className="font-marker text-rust">Zero</span> excuses.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-10 lg:gap-6">
        {steps.map((s, i) => (
          <div key={i} className={`relative ${s.rot} group`}>
            <span className="tape" style={{ top: -14, left: '50%', marginLeft: -55 }} />
            <div className={`relative ${s.color} brut-lg p-7 pt-10 min-h-[320px] flex flex-col`}>
              <div className="flex items-start justify-between mb-5">
                <span className="font-block text-6xl leading-none opacity-90">{s.n}</span>
                <s.icon className="w-12 h-12" strokeWidth={2.2} />
              </div>
              <h3 className="font-display text-3xl leading-tight mb-1">{s.title}</h3>
              <span className="font-hand text-xl text-rust mb-3">{s.note}</span>
              <p className="font-mono text-sm leading-relaxed">{s.body}</p>
              {i < 2 && (
                <div className="hidden md:block absolute -right-12 top-1/2 font-hand text-3xl text-ink rotate-[-8deg] z-10">
                  →
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
