import { useEffect, useState } from 'react';

type Health = { status: 'ok' | 'degraded'; version: string; uptime_s: number; database: { reachable: boolean; latency_ms: number } };

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true); setError(false); setHealth(null);
    const timer = setTimeout(() => controller.abort(), 10000);
    fetch('/api/health', { signal: controller.signal, cache: 'no-store' })
      .then(async response => {
        if (response.status !== 200 && response.status !== 503) throw new Error('API unavailable');
        const data: Health = await response.json();
        if (!['ok', 'degraded'].includes(data.status) || typeof data.database?.reachable !== 'boolean') throw new Error('Invalid response');
        if (active) setHealth(data);
      })
      .catch(() => { if (active) setError(true); })
      .finally(() => { clearTimeout(timer); if (active) setLoading(false); });
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [attempt]);
  return <div className="min-h-screen bg-surface text-ink-900">
    <header className="border-b border-navy-100 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"><a href="/" className="text-lg font-semibold text-navy-900">Mentor & Me</a><span className="text-ink-500">CSUN · Senior Design</span></div></header>
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <p className="mb-4 font-semibold text-navy-700">A connection. A new possibility.</p>
      <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-navy-900 md:text-6xl">Your next chapter starts with a conversation.</h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-ink-500">Mentor & Me brings CSUN students and alumni together. Find shared interests, choose each other, and grow together.</p>
      <section aria-labelledby="status-heading" className="mt-12 max-w-xl rounded-lg border border-navy-100 bg-white p-6 shadow-sm">
        <p className="text-ink-500">Release 1 · Walking skeleton</p><h2 id="status-heading" className="mt-2 text-2xl font-semibold text-navy-900">Connection status</h2>
        <div role="status" aria-live="polite" className="my-5 space-y-2">
          {loading ? <p>Checking application services…</p> : error ? <p className="text-error">The API could not be reached. Please try again.</p> : health && <><p>API: Running · v{health.version}</p><p className={health.database.reachable ? 'text-yes' : 'text-error'}>Database: {health.database.reachable ? `Connected (${health.database.latency_ms} ms)` : 'Unavailable — service is degraded'}</p></>}
        </div>
        <button disabled={loading} onClick={() => setAttempt(n => n + 1)} className="min-h-11 rounded bg-navy-900 px-5 py-2 text-white hover:bg-navy-700 disabled:opacity-50">Check again</button>
      </section>
      <p className="mt-6 max-w-xl text-ink-500">We’re building the foundation. Accounts, mentor discovery, and messaging are coming in future releases.</p>
    </main><footer className="mx-auto max-w-6xl px-6 pb-8 text-ink-500">Built by CSUN CIT Senior Design · Team 3</footer>
  </div>;
}
