import PublicShell from "@/components/PublicShell";

export default function PricingPage() {
  return (
    <PublicShell>
      <section className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-black mb-4'>Pricing & Engagement</h1>

        <p className='mb-4 font-semibold'>
          Carbon eligibility requires specialist assessment. We charge for
          clarity to avoid incorrect assumptions.
        </p>

        <ul className='list-disc ml-5 space-y-2'>
          <li>Carbon Impact Clarity Call: ₹3,000</li>
          <li>Site audit & eligibility review: scoped</li>
          <li>Registry support: only if eligible</li>
        </ul>
      </section>
    </PublicShell>
  );
}
