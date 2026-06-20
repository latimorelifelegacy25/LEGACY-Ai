import React from 'react';

const PRIVATE_HUB_HOSTS = new Set([
  'hub.latimorelifelegacy.com',
  'www.hub.latimorelifelegacy.com',
]);

export function isPrivateHubHost(hostname = window.location.hostname) {
  return PRIVATE_HUB_HOSTS.has(hostname.toLowerCase());
}

export function PrivateHubGate() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0E1A2B',
        color: '#fff',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: 24,
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: 440,
          border: '1px solid rgba(201, 162, 77, 0.32)',
          borderRadius: 24,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035))',
          boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
          padding: '36px 28px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            margin: '0 auto 20px',
            display: 'grid',
            placeItems: 'center',
            background: '#C9A25F',
            color: '#0E1A2B',
            fontSize: 32,
            fontWeight: 900,
          }}
          aria-hidden="true"
        >
          🔒
        </div>
        <p style={{ color: '#C9A25F', fontWeight: 900, letterSpacing: '0.18em', fontSize: 12, margin: '0 0 10px' }}>
          LATIMORE HUB OS
        </p>
        <h1 style={{ fontSize: 30, lineHeight: 1.1, margin: '0 0 12px' }}>Private Workspace</h1>
        <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, margin: 0 }}>
          This operating hub is restricted and is not a public website. Public Latimore Life & Legacy pages remain available on the main domain.
        </p>
        <a
          href="https://latimorelifelegacy.com"
          style={{
            display: 'inline-flex',
            marginTop: 26,
            padding: '12px 18px',
            borderRadius: 999,
            background: '#C9A25F',
            color: '#0E1A2B',
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          Return to Public Site
        </a>
      </section>
    </main>
  );
}
