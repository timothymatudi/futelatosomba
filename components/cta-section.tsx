import Link from "next/link"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-16 lg:py-20">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-balance text-2xl font-bold text-primary-foreground sm:text-3xl lg:text-4xl">
          Are you a property owner or agent?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-primary-foreground/90 leading-relaxed sm:text-lg">
          List your properties on Futelatosomba and reach thousands of potential buyers and renters across the DRC.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-md bg-[#FFD700] px-8 py-3.5 text-base font-bold text-foreground uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Get Started
        </Link>
      </div>
    </section>
  )
}
