import Nav from '@/app/Nav';
import { sql, hasDb } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export default async function AdminPage() {
  const authed = await isAdmin();
  if (!authed) {
    return (
      <>
        <Nav />
        <main><div className="wrap-narrow">
          <h1>Recruiter sign-in</h1>
          <p className="sub">Enter the recruiter access token (ADMIN_TOKEN) to view payment-verified candidates.</p>
          <form method="POST" action="/api/admin/login" className="card">
            <div className="field"><label htmlFor="token">Access token</label><input id="token" name="token" type="password" /></div>
            <button className="btn btn-dark" style={{ width: '100%' }}>Unlock Dashboard</button>
          </form>
        </div></main>
      </>
    );
  }
  let rows: any[] = [];
  if (hasDb) {
    try {
      rows = await sql`select c.id::text as id, c.full_name, c.email, c.phone, c.status, c.created_at, j.title as job_title, p.status as pay_status, p.intent_id from candidates c left join jobs j on j.id = c.job_id left join payments p on p.candidate_id = c.id where c.status in ('verified','scheduled') order by c.created_at desc limit 100`;
    } catch { rows = []; }
  }
  return (
    <>
      <Nav />
      <main style={{ background: '#071a31', color: '#cfdcea' }}><div className="wrap">
        <span className="eyebrow">Recruiter Dashboard: Verified Only</span>
        <h1 style={{ color: '#fff' }}>Payment-verified candidates</h1>
        <p>{rows.length} candidate(s) passed the compliance webhook. Pending applications are hidden by design.</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Candidate</th><th>Mandate</th><th>Payment</th><th>Status</th><th>Applied</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.full_name}</strong><br /><span className="sub">{r.email}{r.phone ? `, ${r.phone}` : ''}</span></td>
                  <td>{r.job_title ?? 'General'}</td>
                  <td><span className="demo">{r.pay_status ?? 'succeeded'}</span><br /><code style={{ fontSize: '.75rem' }}>{r.intent_id ?? ''}</code></td>
                  <td><strong>{r.status}</strong></td>
                  <td>{new Date(r.created_at).toLocaleDateString('en-GB')}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={5} className="center sub" style={{ padding: '2.5rem' }}>No verified candidates yet. Connect DATABASE_URL, run db:setup, then complete a verification.</td></tr>}
            </tbody>
          </table>
        </div>
      </div></main>
    </>
  );
}
