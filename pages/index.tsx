import Head from "next/head"

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Futelatosomba - Find Your Dream Home in DRC</title>
        <meta
          name="description"
          content="The leading property platform in the Democratic Republic of Congo. Buy, rent, or sell properties across Kinshasa, Lubumbashi, Goma, and more."
        />
        <meta name="theme-color" content="#007FFF" />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <main className="flex flex-col items-center gap-8 p-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Futelatosomba
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            The leading property platform in the Democratic Republic of Congo.
            Buy, rent, or sell properties across Kinshasa, Lubumbashi, Goma, and
            more.
          </p>
          <div className="flex gap-4">
            <a
              href="#properties"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
            >
              Browse Properties
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-md border border-border bg-card px-6 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-muted"
            >
              Learn More
            </a>
          </div>
        </main>
      </div>
    </>
  )
}
