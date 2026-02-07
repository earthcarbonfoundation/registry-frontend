import PublicShell from "@/components/PublicShell";

export default function HowItWorks() {
  return (
    <PublicShell>
      <section className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-black mb-4'>How It Works</h1>

        <ol className='space-y-3 list-decimal ml-5'>
          <li>Eligibility screening (baseline, ownership, scale)</li>
          <li>Site review & audit readiness</li>
          <li>Carbon preparedness (MRV, aggregation)</li>
          <li>Registry pathway only if eligible</li>
        </ol>
      </section>
    </PublicShell>
  );
}
