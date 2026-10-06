import Nav from '@/app/Nav';
export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ receipt?: string }> }) {
  const sp = await searchParams;
  return (
    <>
      <Nav />
      <main><div className="wrap-narrow center">
        <span className="eyebrow">Payment verified</span>
        <h1>Compliance cleared. Welcome to the shortlist process.</h1>
        <p className="sub">Receipt: <code>{sp?.receipt ?? 'mock receipt'}</code></p>
        <p className="sub">A senior partner will review your vault within one business day.</p>
        <div className="cta" style={{ justifyContent: 'center' }}>
          <a href="/schedule" className="btn btn-dark">Book Interview</a>
          <a href="/" className="btn btn-ghost" style={{ color: '#0a2342', borderColor: '#b9c7d6' }}>Return Home</a>
        </div>
      </div></main>
    </>
  );
}
