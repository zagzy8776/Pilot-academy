'use client';
import { useEffect, useState } from 'react';
type Slot = { id: string; starts_at: string; ends_at: string; partner: string };
export default function ScheduleClient({ candidate, initialSlots }: { candidate: string; initialSlots: Slot[] }) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [verified, setVerified] = useState<boolean | null>(initialSlots.length ? true : null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState('');
  useEffect(() => {
    if (!candidate) { setVerified(false); return; }
    fetch(`/api/me/status?candidateId=${encodeURIComponent(candidate)}`)
      .then((r) => r.json())
      .then((d) => {
        const ok = d.status === 'verified' || d.status === 'scheduled';
        setVerified(ok);
        if (!ok) setMsg(`Scheduling is locked (status: "${d.status}"). Complete the compliance webhook first.`);
      })
      .catch(() => setVerified(false));
  }, [candidate]);
  async function book(id: string) {
    setBusy(id); setMsg('');
    const res = await fetch('/api/interviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ candidateId: candidate, slotId: id }) });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error ?? 'Booking failed'); setBusy(''); return; }
    setSlots((s) => s.filter((x) => x.id !== id));
    setMsg('Interview confirmed. Calendar invitation and NDA pack will follow by email.');
    setBusy('');
  }
  if (verified === false) {
    return (
      <div className="card center">
        <h2>Scheduling locked: verification required</h2>
        <p className="sub">{msg || 'Only candidates with a successful compliance webhook can access scheduling.'}</p>
        <a href="/apply" className="btn btn-dark">Complete Verification</a>
      </div>
    );
  }
  return (
    <div>
      {msg && <p role="status" className="okmsg">{msg}</p>}
      <div className="grid2">
        {slots.map((s) => (
          <article key={s.id} className="card">
            <p className="eyebrow" style={{ marginBottom: '.3rem' }}>{s.partner}</p>
            <h3>{new Date(s.starts_at).toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</h3>
            <p className="sub">30 minutes, confidential video, NDA covered</p>
            <button disabled={!candidate || busy === s.id} onClick={() => book(s.id)} className="btn btn-dark" style={{ width: '100%' }}>{busy === s.id ? 'Booking…' : 'Reserve This Slot'}</button>
          </article>
        ))}
      </div>
      {!slots.length && <p className="sub">No open slots. New partner availability releases every Monday.</p>}
    </div>
  );
}
