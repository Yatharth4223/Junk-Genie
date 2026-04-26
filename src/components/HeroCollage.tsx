import junkPile from "@/assets/junk-pile.png";
import { staticImageUrl } from "@/lib/staticImageUrl";
import { ArrowRight, Sparkles, Wand2, Star, Heart, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroCollage = () => {
  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Soft green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-eco-sage/40 via-paper to-sky/20" />
      
      {/* Floating leaves decoration */}
      <Leaf className="absolute top-20 left-[10%] w-6 h-6 text-eco-leaf animate-bounce-soft" />
      <Leaf className="absolute top-40 right-[15%] w-5 h-5 text-eco-moss animate-bounce-soft" style={{animationDelay: '0.5s'}} />
      <Leaf className="absolute bottom-32 left-[20%] w-4 h-4 text-eco-forest animate-bounce-soft" style={{animationDelay: '1s'}} />
      
      <div className="relative mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT — cleaner headline */}
        <div className="relative z-10">
          {/* Friendly badge */}
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-eco-leaf text-paper px-4 py-2 rounded-full font-block text-sm flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" />
              Family Fun!
            </div>
          </div>

          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.1] tracking-tight mb-6">
            <span className="text-ink">Turn your</span>{" "}
            <span className="text-eco-forest font-block">stuff</span>
            <br />
            <span className="text-ink">into</span>{" "}
            <span className="text-rust font-marker">awesome Crafts!</span>
          </h1>

          <p className="max-w-md font-mono text-base leading-relaxed text-ink-soft mb-8">
            Snap a photo of things around your home. Our friendly genie will 
            suggest fun projects you can build together as a family! 🌱✨
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/create"
              className="group bg-eco-forest text-paper font-block uppercase text-base px-8 py-4 rounded-xl shadow-brut hover:bg-eco-leaf transition-colors flex items-center gap-3"
            >
              <Wand2 className="w-5 h-5" />
              Start Creating!
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <button className="bg-paper border-2 border-eco-forest text-ink font-block uppercase text-base px-6 py-4 rounded-xl shadow-brut-sm hover:bg-eco-sage/30 transition-colors">
              See How It Works
            </button>
          </div>

          {/* Simple tag pills */}
          <div className="mt-8 flex flex-wrap gap-2 font-mono text-xs uppercase tracking-wider">
            {[
              { t: "📸 Easy Photos", c: "bg-eco-sage text-ink" },
              { t: "🧠 AI Magic", c: "bg-sky text-ink" },
              { t: "🎨 Fun Crafts", c: "bg-bubble text-ink" },
              { t: "👨‍👩‍👧‍👦 Family Time", c: "bg-grass text-ink" },
            ].map((p,i) => (
              <span key={i} className={`${p.c} px-3 py-1.5 rounded-full border border-ink/10`}>{p.t}</span>
            ))}
          </div>
        </div>

        {/* RIGHT — cleaner image area */}
        <div className="relative flex items-center justify-center">
          {/* Soft green blob behind */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[380px] h-[380px] bg-gradient-to-br from-eco-leaf/30 to-eco-sage/50 rounded-full blur-3xl" />
          </div>
          
          {/* Main image with soft shadow */}
          <div className="relative z-10">
            <img
              src={staticImageUrl(junkPile)}
              alt="A pile of household items ready to become toys"
              width={500} height={500}
              className="w-full max-w-[420px] drop-shadow-2xl animate-float-up"
            />
            
            {/* Sparkle decorations */}
            <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-caution animate-flicker" />
            <Heart className="absolute -bottom-2 -left-4 w-6 h-6 text-rust fill-rust animate-bounce-soft" />
            <Star className="absolute top-1/4 -right-6 w-5 h-5 text-eco-leaf fill-eco-leaf animate-wiggle" />
          </div>
          
          {/* Simple testimonial card */}
          <div className="absolute -bottom-6 -left-6 z-20 bg-paper border-2 border-eco-forest rounded-2xl p-4 shadow-brut max-w-[200px]">
            <div className="font-hand text-lg text-ink leading-tight">
              "We made a robot from cereal boxes!"
            </div>
            <div className="mt-2 font-mono text-xs text-ink-soft">
              — The Patel Family 🤖
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
