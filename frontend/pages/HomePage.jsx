  import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const FEATURES = [
    { icon: '🔬', title: t('features.advancedTests') || 'Advanced Lab Tests',        desc: t('features.advancedTestsDesc') || 'Access 200+ diagnostic tests with real-time results and AI-powered interpretation.' },
    { icon: '🤖', title: t('features.aiInterpretation') || 'AI Interpretation',          desc: t('features.aiInterpretationDesc') || 'Smart analysis of your results with risk-level assessment and specialist recommendations.' },
    { icon: '📊', title: t('features.healthTrends') || 'Health Trends',              desc: t('features.healthTrendsDesc') || 'Track your health metrics over time with visual trend analysis and insights.' },
    { icon: '💊', title: t('features.preventiveCare') || 'Preventive Care',            desc: t('features.preventiveCareDesc') || 'Personalized checkup recommendations based on your age, gender, and health history.' },
    { icon: '📄', title: t('features.ocrUpload') || 'OCR Report Upload',          desc: t('features.ocrUploadDesc') || 'Upload external medical reports and let AI extract and analyse the data automatically.' },
    { icon: '🏅', title: t('features.rewards') || 'Rewards Program',            desc: t('features.rewardsDesc') || 'Earn points on every test and unlock exclusive membership discounts.' },
  ];

  const STATS = [
    ['10K+', t('home.statsPatients')],
    ['200+', t('home.statsTests')],
    ['24 hr', t('home.statsResults')],
  ];

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* ── Background blobs ── */}
      <div className="hex-blob" style={{ top: -100, right: -100 }} />
      <div className="hex-blob" style={{ bottom: 200, left: -150 }} />

      {/* ════════════════════ HERO ════════════════════ */}
      <section
        style={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'flex-start',
          padding: '16px 24px 30px',
          position: 'relative',
          overflow: 'hidden',
          background: `
            linear-gradient(135deg, rgba(2,12,22,0.75) 0%, rgba(4,17,30,0.8) 100%),
            url('/home-bg.jpg')
          `,
          backgroundSize: '110%',
          backgroundPosition: 'center 20%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 60,
            alignItems: 'center',
          }}
        >
          {/* Left column */}
          <div>
            <div className="sl-badge anim-fade-up" style={{ marginBottom: 20 }}>
              {t('home.heroBadge')}
            </div>

            <h1
              className="anim-fade-up d-1"
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 'clamp(34px, 5vw, 60px)',
                fontWeight: 600,
                lineHeight: 1.05,
                marginBottom: 14,
                letterSpacing: '-1px',
                color: '#effcfb',
                maxWidth: 520,
                transform: 'translateY(-18px)'
              }}
            >
              {t('home.heroTitle1')}<br />
              <span style={{ color: '#0bceaa', display: 'inline-block' }}>{t('home.heroTitle2')}</span><br />
              {t('home.heroTitle3')}
            </h1>

            <p
              className="anim-fade-up d-2"
              style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}
            >
              {t('home.heroDesc')}
            </p>

            <div className="anim-fade-up d-3" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <Link to="/register">
                <button className="btn-primary" style={{ fontSize: 15, padding: '14px 28px' }}>
                  {t('home.bookTest')}
                </button>
              </Link>
              <Link to="/login">
                <button className="btn-outline" style={{ fontSize: 15 }}>{t('home.viewResults')}</button>
              </Link>
            </div>

            {/* Stats */}
            <div className="anim-fade-up d-4" style={{ display: 'flex', gap: 32 }}>
              {STATS.map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#0bceaa' }}>{n}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column – decorative cards */}
          <div className="anim-fade-up d-2" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 360, height: 400 }}>
              {/* Result card */}
              <div
                className="sl-glow"
                style={{
                  background: 'var(--navy2)',
                  border: '1px solid rgba(11,206,170,.2)',
                  borderRadius: 20,
                  padding: 24,
                  width: 280,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12, letterSpacing: 1 }}>LATEST RESULT</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(11,206,170,.1)', border: '1px solid rgba(11,206,170,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🩸</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Complete Blood Count</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Today, 9:30 AM</div>
                  </div>
                </div>
                {[['Hemoglobin', '14.2 g/dL'], ['WBC', '7.1 K/µL'], ['Platelets', '180 K/µL']].map(([n, v]) => (
                  <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid rgba(11,206,170,.08)' }}>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{n}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
                      <span style={{ fontSize: 10, background: 'rgba(11,206,170,.1)', color: '#0bceaa', padding: '2px 8px', borderRadius: 20 }}>normal</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Appointment card */}
              <div style={{ background: 'var(--navy2)', border: '1px solid rgba(11,206,170,.15)', borderRadius: 16, padding: 18, width: 220, position: 'absolute', bottom: 20, right: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10, letterSpacing: 1 }}>NEXT APPOINTMENT</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#0bceaa' }}>Thu 18</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>April 2026 · 10:00 AM</div>
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text)' }}>Lipid Profile + Fasting Blood Sugar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="sl-divider" style={{ maxWidth: 1100, margin: '0 auto' }} />

      {/* ════════════════════ FEATURES ════════════════════ */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="sl-badge" style={{ marginBottom: 14 }}>{t('home.ourServices')}</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 700, letterSpacing: '-.5px' }}>
              {t('home.featuresTitle')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="sl-card"
                style={{ display: 'flex', gap: 16, alignItems: 'flex-start', cursor: 'default' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(11,206,170,.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(11,206,170,.12)')}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(11,206,170,.1)', border: '1px solid rgba(11,206,170,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ CTA ════════════════════ */}
      <section style={{ padding: '60px 24px', background: 'var(--navy2)', borderTop: '1px solid rgba(11,206,170,.08)', borderBottom: '1px solid rgba(11,206,170,.08)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, marginBottom: 16 }}>
            {t('home.ctaTitle')}
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: 15 }}>
            {t('home.ctaDesc')}
          </p>
          <Link to="/register">
            <button className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
              {t('home.ctaButton')} →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: 24, textAlign: 'center', color: '#3d6a68', fontSize: 13, borderTop: '1px solid rgba(11,206,170,.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16 }}>
          <a href="#" style={{ color: '#3d6a68', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#0bceaa'} onMouseLeave={(e) => e.currentTarget.style.color = '#3d6a68'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" style={{ color: '#3d6a68', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#0bceaa'} onMouseLeave={(e) => e.currentTarget.style.color = '#3d6a68'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a href="#" style={{ color: '#3d6a68', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#0bceaa'} onMouseLeave={(e) => e.currentTarget.style.color = '#3d6a68'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="#" style={{ color: '#3d6a68', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#0bceaa'} onMouseLeave={(e) => e.currentTarget.style.color = '#3d6a68'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="#" style={{ color: '#3d6a68', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#0bceaa'} onMouseLeave={(e) => e.currentTarget.style.color = '#3d6a68'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
        </div>
        
      </footer>
    </div>
  );
}
