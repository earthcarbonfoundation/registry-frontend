import PublicShell from "@/components/PublicShell";

export default function ImpactPage() {
  return (
    <PublicShell>
      <section className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-black mb-4'>Impact</h1>

        <p className='mb-4 font-semibold'>
          Earth Carbon Registry tracks low-carbon actions and carbon-credit
          preparedness. Credit issuance is subject to registry methodologies,
          MRV requirements, and host-country authorization.
        </p>

        <p>
          ESG actions do not automatically qualify as carbon credits. We measure
          and publish verified actions so projects gain clarity on eligibility
          and potential pathways to issuance.
        </p>
      </section>
    </PublicShell>
  );
}
