'use client';
import { useWizState, validateStep } from './wizardState';
import { StepProfile, StepDocs, StepGate } from './WizardSteps';
type Props = { jobs: { id: string; title: string }[]; initialJob: string };
export default function Wizard({ jobs, initialJob }: Props) {
  const s = useWizState(initialJob);
  const { step, setStep, f, set } = s;
  async function next() {
    s.setError('');
    const e = validateStep(f, step);
    s.setErrs(e);
    if (e.length) return;
    s.setBusy(true);
    try {
      if (step === 0) {
        const res = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Could not save profile');
        s.setCandidateId(data.candidateId);
        s.setStatus(data.status);
      } else {
        const res = await fetch('/api/documents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ candidateId: s.candidateId, resumeName: f.resumeName, resumeSize: f.resumeSize || 1024, credentialName: f.credentialName }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Could not save documents');
      }
      setStep(Math.min(2, step + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) { s.setError(e.message); }
    s.setBusy(false);
  }
  async function pay() {
    s.setError('');
    const e = validateStep(f, 2);
    s.setErrs(e);
    if (e.length) return;
    s.setBusy(true);
    try {
      const r1 = await fetch('/api/payments/create-intent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ candidateId: s.candidateId }) });
      const d1 = await r1.json();
      if (!r1.ok) throw new Error(d1.error ?? 'Could not start payment');
      s.setIntentId(d1.intentId);
      const r2 = await fetch('/api/payments/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ intentId: d1.intentId }) });
      if (!r2.ok) throw new Error((await r2.json()).error ?? 'Payment failed');
      const r3 = await fetch('/api/webhooks/stripe', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-mock-webhook-secret': 'dev-mock-secret' }, body: JSON.stringify({ intentId: d1.intentId }) });
      if (!r3.ok) throw new Error((await r3.json()).error ?? 'Verification failed');
      s.setStatus('verified');
    } catch (e: any) { s.setError(e.message); }
    s.setBusy(false);
  }
  const titles = ['Profile', 'Document Vault', 'Compliance Gate'];
  return (
    <div>
      <ol className="progress" aria-label="Progress">
        {titles.map((t, i) => (<li key={t} className={i === step ? 'on' : i < step ? 'done' : ''}>{i + 1}. {t}</li>))}
      </ol>
      {s.error && <p role="alert" className="alert">{s.error}</p>}
      {!!s.errs.length && <ul className="alert">{s.errs.map((e) => <li key={e}>{e}</li>)}</ul>}
      {step === 0 && <StepProfile f={f} set={set} jobs={jobs} />}
      {step === 1 && <StepDocs f={f} set={set} />}
      {step === 2 && <StepGate f={f} set={set} status={s.status} intentId={s.intentId} />}
      <div className="wiznav">
        <button type="button" className="btn btn-ghost" style={{ color: '#0a2342', borderColor: '#b9c7d6' }} disabled={step === 0 || s.busy} onClick={() => setStep(step - 1)}>Back</button>
        {step < 2 && <button type="button" className="btn" disabled={s.busy} onClick={next}>{s.busy ? 'Saving…' : 'Continue Securely'}</button>}
        {step === 2 && s.status !== 'verified' && <button type="button" className="btn btn-dark" disabled={s.busy} onClick={pay}>{s.busy ? 'Verifying…' : 'Pay $49.00 & Verify'}</button>}
        {step === 2 && s.status === 'verified' && <a className="btn" href={`/schedule?candidate=${s.candidateId}`}>Enter Interview Scheduling</a>}
      </div>
      <p className="statusline">Status: <strong>{s.status === 'verified' ? 'Verified: scheduling unlocked' : 'Pending: webhook confirmation required'}</strong></p>
    </div>
  );
}
