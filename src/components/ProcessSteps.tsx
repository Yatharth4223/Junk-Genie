import { Camera, Brain, Hammer } from "lucide-react";

const steps = [
  { n: "01", icon: Camera, title: "Snap the mess", note: "yes, that mess", body: "Point your phone at the pile. The crusty toaster, the bent fork, the mystery cable from 2009 — all of it. The grosser the better 🤌", color: "bg-caution", rot: "r-l2" },
  { n: "02", icon: Brain, title: "Genie squints", note: "thinking noises 🤔", body: "A tiny AI brain looks at your junk and goes 'ohhh i KNOW what this could be'. Then makes a list of suspiciously cool ideas.", color: "bg-paper", rot: "r-r1" },
  { n: "03", icon: Hammer, title: "Make a thing", note: "send pics pls 📸", body: "Pick an idea, follow the steps, build something gloriously dumb. Show it off. Confuse your roommates. Win at life.", color: "bg-rust text-paper", rot: "r-l1" },
];

export const ProcessSteps = () => (
  <section id="process" className="relative kraft border-y-2 border-ink py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="flex flex-col items-center mb-16">
        <span className="font-mono uppercase text-xs tracking-[0.4em] bg-ink text-paper px-3 py-1 mb-4">// how the magic happens</span>
        <h2 className="font-display text-5xl md:text-7xl text-center leading-none">
          Three clicks. <span className="font-marker text-rust">One</span> goblin idea. 🧞
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
