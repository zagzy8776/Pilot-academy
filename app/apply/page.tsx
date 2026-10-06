import Nav from '@/app/Nav';
import Wizard from '@/components/Wizard';
import { getPrograms } from '@/lib/queries';
export const dynamic = 'force-dynamic';
export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ job?: string }> }) {
  const sp = await searchParams;
  const programs = (await getPrograms()).map((p) => ({ id: String(p.id), title: p.name }));
  return (
    <>
      <Nav />
      <main className="apply">
        <div className="wrap apply-grid">
          <div>
            <span className="eyebrow">Confidential Application</span>
            <h2>Your route to the shortlist</h2>
            <p>Three gated stages. Submission remains <strong>Pending</strong> until the compliance webhook confirms.</p>
            <div className="card" style={{ color: '#10202f', marginBottom: '1rem' }}><strong>256-bit encrypted</strong>, SOC 2-aligned handling</div>
            <div className="card" style={{ color: '#10202f', marginBottom: '1rem' }}><strong>Partner-held</strong>. Never shared without consent.</div>
            <div className="card" style={{ color: '#10202f' }}><strong>Mock payment</strong>. Clearly labelled demo, no real charge.</div>
          </div>
          <div className="wizard">
            <Wizard jobs={programs} initialJob={sp?.job ?? ''} />
          </div>
        </div>
      </main>
    </>
  );
}
