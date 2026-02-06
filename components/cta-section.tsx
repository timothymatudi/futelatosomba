import Link from "next/link"

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-accent px-4 py-16 text-center text-accent-foreground lg:py-20">
      <div className="relative z-10 mx-auto max-w-2xl">
        <h2 className="text-balance text-2xl font-bold text-accent-foreground sm:text-3xl lg:text-4xl">
          Are you a property owner or agent?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-lg text-accent-foreground/90 leading-relaxed">
          List your properties on Futelatosomba and reach thousands of potential
          buyers and renters across DRC.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-md bg-secondary px-8 py-3 text-base font-bold uppercase tracking-wide text-secondary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          Get Started
        </Link>
      </div>
    </section>
  )
}
