import PublicShell from "@/components/PublicShell";

export default function AboutPage() {
  return (
    <PublicShell>
      <section className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-black mb-4'>
          About Earth Carbon Registry
        </h1>

        <p className='mb-4 font-semibold'>
          Earth Carbon Registry tracks verified low-carbon actions and
          carbon-credit preparedness — not instant credits.
        </p>

        <p>
          We help projects assess eligibility early and avoid rejection,
          retroactive risks, and reputational exposure.
        </p>
      </section>
    </PublicShell>
  );
}
