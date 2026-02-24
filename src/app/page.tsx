import PublicShell from "@/components/PublicShell";

export default function HomePage() {
  return (
    <PublicShell>
      <section className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-black mb-6'>Earth Carbon Registry</h1>

        <p className='text-lg mb-4'>
          A public registry for verified low-carbon actions and carbon-credit
          preparedness.
        </p>

        <p className='text-lg'>
          This platform tracks emissions reduction, readiness, and impact — not
          instant carbon credits.
        </p>
      </section>
    </PublicShell>
  );
}
