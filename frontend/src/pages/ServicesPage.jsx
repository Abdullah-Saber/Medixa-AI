import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

export default function ServicesPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const services = [
    { 
      title: 'Lab Test Booking', 
      description: 'Book lab tests online with ease. Choose from a wide range of tests and schedule your appointment at your convenience.', 
      icon: '📋',
      link: '/patient/lab-tests'
    },
    { 
      title: 'Result Tracking', 
      description: 'Track your test results in real-time. Get notified when your results are ready and view them securely online.', 
      icon: '📊',
      link: '/login'
    },
    { 
      title: 'Doctor Consultation', 
      description: 'Connect with specialized doctors for expert consultation on your test results and health concerns.', 
      icon: '👨‍⚕️',
      link: '/book-appointment'
    },
    { 
      title: 'AI Interpretation', 
      description: 'Get AI-powered insights on your test results. Understand your health data with intelligent analysis and recommendations.', 
      icon: '�',
      link: '/login'
    },
    { 
      title: 'Appointment Scheduling', 
      description: 'Schedule appointments with doctors and lab visits online. Manage your healthcare appointments effortlessly.', 
      icon: '�',
      link: '/book-appointment'
    },
  ];

  const reasons = [
    { icon: '✅', text: t('services.reason1') || 'High accuracy in results' },
    { icon: '✅', text: t('services.reason2') || 'Fast turnaround time' },
    { icon: '✅', text: t('services.reason3') || 'Certified specialist team' },
    { icon: '✅', text: t('services.reason4') || 'Competitive pricing' },
    { icon: '✅', text: t('services.reason5') || 'Full patient data privacy' },
  ];

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroDecor1} />
        <div style={styles.heroDecor2} />
        <div style={styles.heroDecor3} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>{t('services.title')}</h1>
          <p style={styles.heroSubtitle}>
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section style={styles.contentSection}>
        <div style={styles.contentWrapper}>

          <div style={styles.featuresGrid}>
            {services.map((service, index) => (
              <Link key={index} to={service.link} style={{ textDecoration: 'none' }}>
                <div style={styles.featureCard} className="featureCard">
                  <div style={styles.featureIcon}>{service.icon}</div>
                  <h3 style={styles.featureTitle}>{service.title}</h3>
                  <p style={styles.featureDescription}>{service.description}</p>
                  <div style={styles.serviceLink}>Learn More →</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Why Choose Us */}
          <div style={styles.whySection}>
            <h2 style={styles.sectionTitle}>Why Choose Our Lab?</h2>
            <div style={styles.reasonsGrid}>
              {reasons.map((reason, index) => (
                <div key={index} style={styles.reasonCard} className="reasonCard">
                  <span style={styles.reasonIcon}>{reason.icon}</span>
                  <p style={styles.reasonText}>{reason.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={styles.ctaSection}>
            <p style={styles.ctaText}>
              {t('services.ctaText') || 'Ready to book your tests? Contact us today and get your results with precision and speed.'}
            </p>
            <Link to="/book-appointment" style={{ textDecoration: 'none' }}>
              <button style={styles.ctaButton}>{t('nav.bookAppointment')}</button>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#e8f4f0',
    background: 'radial-gradient(circle at top left, rgba(11,206,170,.14), transparent 22%), radial-gradient(circle at top right, rgba(11,206,170,.08), transparent 20%), linear-gradient(180deg, #03111c 0%, #04111e 100%)',
    minHeight: '100vh',
  },

  // Hero
  heroSection: {
    background: 'radial-gradient(circle at top left, rgba(11,206,170,.18), transparent 24%), radial-gradient(circle at top right, rgba(11,206,170,.08), transparent 20%), linear-gradient(135deg, rgba(2,12,22,0.96) 0%, rgba(4,17,30,0.96) 100%)',
    color: 'white',
    padding: '100px 20px 110px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  heroDecor1: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    top: '-80px',
    left: '-80px',
    pointerEvents: 'none',
  },
  heroDecor2: {
    position: 'absolute',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    bottom: '-60px',
    right: '-50px',
    pointerEvents: 'none',
  },
  heroDecor3: {
    position: 'absolute',
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
    top: '40px',
    right: '15%',
    pointerEvents: 'none',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    margin: '0 0 18px 0',
    lineHeight: '1.1',
    letterSpacing: '-1px',
  },
  heroSubtitle: {
    fontSize: '18px',
    fontWeight: '400',
    margin: '0 auto',
    opacity: '0.82',
    lineHeight: '1.7',
    maxWidth: '600px',
  },

  // Content
  contentSection: {
    padding: '80px 20px',
    background: 'transparent',
  },
  contentWrapper: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '600',
    margin: '0 0 20px 0',
    color: '#e8f4f0',
  },

  // Services Grid
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '80px',
  },
  featureCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.14)',
    padding: '30px',
    borderRadius: '18px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    backdropFilter: 'blur(12px)',
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 25px 80px rgba(11,206,170,0.25)',
      borderColor: 'rgba(11,206,170,0.4)',
    },
  },
  featureIcon: {
    fontSize: '40px',
    marginBottom: '15px',
    display: 'block',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 12px 0',
    color: '#f4fbf9',
  },
  featureDescription: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'rgba(232,244,240,0.78)',
    margin: 0,
  },
  serviceLink: {
    marginTop: '16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0bceaa',
    transition: 'all 0.2s ease',
  },

  // Why Section
  whySection: {
    marginBottom: '80px',
  },
  reasonsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
    marginTop: '30px',
  },
  reasonCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: '28px 20px',
    borderRadius: '16px',
    border: '1px solid rgba(11,206,170,0.12)',
    boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  reasonIcon: {
    fontSize: '28px',
    display: 'block',
    marginBottom: '10px',
  },
  reasonText: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#e8f4f0',
    margin: 0,
  },

  // CTA
  ctaSection: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
    padding: '60px 40px',
    borderRadius: '30px',
    textAlign: 'center',
    boxShadow: '0 30px 80px rgba(0,0,0,0.24)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(16px)',
  },
  ctaText: {
    fontSize: '20px',
    lineHeight: '1.6',
    color: '#f8fcfb',
    maxWidth: '700px',
    margin: '0 auto 30px',
    fontWeight: '500',
  },
  ctaButton: {
    background: 'linear-gradient(135deg, #4f6af8 0%, #5f7fff 100%)',
    color: '#061038',
    border: 'none',
    padding: '16px 44px',
    fontSize: '17px',
    fontWeight: '700',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 18px 40px rgba(79,106,248,0.24)',
  },
};

// Hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  button:hover {
    background-color: #5568d3 !important;
    transform: translateY(-2px) !important;
  }
  
  /* Service Card Hover Effects */
  .featureCard {
    transition: all 0.3s ease !important;
  }
  
  .featureCard:hover {
    transform: translateY(-8px) !important;
    box-shadow: 0 25px 80px rgba(11,206,170,0.25) !important;
    border-color: rgba(11,206,170,0.4) !important;
  }
  
  .featureCard:active {
    transform: translateY(-4px) scale(0.98) !important;
  }
  
  .reasonCard {
    transition: all 0.3s ease !important;
  }
  
  .reasonCard:hover {
    transform: translateY(-6px) !important;
    box-shadow: 0 20px 60px rgba(11,206,170,0.2) !important;
    border-color: rgba(11,206,170,0.3) !important;
  }
  
  @media (max-width: 768px) {
    h1 { font-size: 36px !important; }
    h2 { font-size: 24px !important; }
  }
`;
if (document.head) {
  document.head.appendChild(styleSheet);
}
