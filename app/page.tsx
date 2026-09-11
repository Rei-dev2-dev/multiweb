import ShapeGrid from "@/components/ShapeGrid";
import SplitText from "@/components/SplitText";
import ConstellationBackground from "@/components/ConstellationBackground";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden selection:bg-blue-100 selection:text-blue-700">
      {/* LEFT COLUMN: Login Form with ShapeGrid Background */}
      <section className="w-full lg:w-[48%] xl:w-[42%] min-h-screen flex flex-col justify-center items-center relative p-6 sm:p-10 border-r border-slate-100 overflow-hidden bg-white">
        {/* React Bits ShapeGrid Canvas in background (restored to original) */}
        <div className="absolute inset-0 z-0 pointer-events-auto opacity-70">
          <ShapeGrid
            direction="diagonal"
            speed={0.3}
            squareSize={48}
            borderColor="rgba(203, 213, 225, 0.45)"
            hoverFillColor="rgba(37, 99, 235, 0.08)"
            shape="square"
            hoverTrailAmount={5}
            className="w-full h-full"
          />
        </div>

        {/* Subtle radial mask to make the form area clear and readable while showing grid around */}
        <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.92)_0%,_rgba(255,255,255,0.72)_60%,_rgba(255,255,255,0.25)_100%)]" />

        {/* Interactive Login Form */}
        <div className="relative z-10 w-full flex justify-center">
          <LoginForm />
        </div>
      </section>

      {/* RIGHT COLUMN: Interactive Constellation Mesh with React Bits SplitText */}
      <section className="hidden lg:flex flex-1 min-h-screen relative flex-col items-center justify-center bg-slate-50/40 overflow-hidden">
        {/* Interactive Constellation Mesh Canvas matching reference image */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <ConstellationBackground
            nodeCount={75}
            maxDistance={140}
            lineColor="rgba(148, 163, 184, 0.35)"
            nodeColor="rgba(100, 116, 139, 0.7)"
          />
        </div>

        {/* Ambient Gradient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Big Bold Headline with React Bits SplitText and Outfit Font */}
        <div className="relative z-10 px-8 text-center select-none max-w-2xl font-[family-name:var(--font-outfit)]">
          <h1 className="text-3xl xl:text-[45px] font-extrabold tracking-[-0.03em] text-slate-900 leading-[1.22] flex flex-col items-center gap-1 drop-shadow-xs">
            <SplitText
              text="WELCOM TO"
              className="text-slate-900 font-extrabold tracking-[-0.03em]"
              delay={40}
              duration={0.8}
              ease="power3.out"
              useScrollTrigger={false}
            />
            <SplitText
              text="MULTIPLE FUNCTION WEB"
              className="text-slate-900 font-extrabold tracking-[-0.03em]"
              delay={35}
              duration={0.8}
              ease="power3.out"
              useScrollTrigger={false}
            />
            <div className="flex items-center justify-center gap-3 mt-0.5">
              <SplitText
                text="BY"
                className="text-slate-900 font-extrabold tracking-[-0.03em]"
                delay={40}
                duration={0.8}
                ease="power3.out"
                useScrollTrigger={false}
              />
              <SplitText
                text="Multinet"
                className="text-blue-600 font-extrabold tracking-[-0.03em]"
                delay={45}
                duration={0.9}
                ease="power3.out"
                useScrollTrigger={false}
              />
            </div>
          </h1>
        </div>
      </section>
    </main>
  );
}
