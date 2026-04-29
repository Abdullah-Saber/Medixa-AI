import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

const AboutPage = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const features = [
    {
      icon: '🔬',
      title: t('about.feature1') || 'AI-Powered Diagnostics',
      description: t('about.feature1Desc') || 'Advanced AI algorithms analyze your test results for accurate, personalized health insights.'
    },
    {
      icon: '📊',
      title: t('about.feature2') || 'Real-Time Results',
      description: t('about.feature2Desc') || 'Get your lab results instantly through our secure online portal, available 24/7.'
    },
    {
      icon: '🤝',
      title: t('about.feature3') || 'Expert Consultation',
      description: t('about.feature3Desc') || 'Connect with certified specialists for personalized health consultations and guidance.'
    },
    {
      icon: '⚙️',
      title: t('about.feature4') || 'Modern Equipment',
      description: t('about.feature4Desc') || 'State-of-the-art laboratory equipment ensuring the highest accuracy in all our tests.'
    }
  ];

  const stats = [
    { number: '10K+', label: t('about.patients') || 'Patients Served' },
    { number: '200+', label: t('about.tests') || 'Lab Tests' },
    { number: '50+', label: t('about.specialists') || 'Certified Specialists' },
  ];

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroDecor1} />
        <div style={styles.heroDecor2} />
        <div style={styles.heroDecor3} />

        <div style={styles.heroContent}>
          <div style={styles.badge}>{t('about.badge') || '✦ About Us'}</div>
          <h1 style={styles.heroTitle}>{t('about.title')}</h1>
          <p style={styles.heroSubtitle}>
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={styles.contentSection}>
        <div style={styles.contentWrapper}>
          {/* Mission */}
          <div style={styles.textBlock}>
            <h2 style={styles.sectionTitle}>{t('about.mission')}</h2>
            <p style={styles.paragraph}>
              {t('about.missionText1') || 'SmartLab is a revolutionary medical diagnostics platform designed to make healthcare more accessible and efficient. We combine cutting-edge laboratory technology with AI-powered analysis to deliver accurate results and personalized health insights.'}
            </p>
            <p style={styles.paragraph}>
              {t('about.missionText2') || 'Our mission is to empower individuals with instant access to their health data, enabling proactive healthcare decisions and better outcomes through early detection and continuous monitoring.'}
            </p>
          </div>

          {/* Stats */}
          <div style={styles.statsSection}>
            <div style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <div key={index} style={styles.statCard}>
                  <div style={styles.statNumber}>{stat.number}</div>
                  <p style={styles.statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div style={styles.featuresSection}>
            <h2 style={styles.sectionTitle}>{t('about.featuresTitle') || 'What Makes Us Different'}</h2>
            <div style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div key={index} style={styles.featureCard}>
                  <div style={styles.featureIcon}>{feature.icon}</div>
                  <h3 style={styles.featureTitle}>{feature.title}</h3>
                  <p style={styles.featureDescription}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vision */}
          <div style={styles.visionSection}>
            <h2 style={styles.sectionTitle}>{t('about.vision')}</h2>
            <p style={styles.paragraph}>
              {t('about.visionText') || 'We envision a future where everyone has immediate access to their health information, enabling proactive healthcare and early disease detection. By combining advanced diagnostics with artificial intelligence, we aim to transform how people understand and manage their health.'}
            </p>
          </div>

          {/* CTA */}
          <div style={styles.ctaSection}>
            <p style={styles.ctaText}>
              {t('about.ctaText') || 'Ready to take control of your health? Join thousands of patients who trust SmartLab for their diagnostic needs.'}
            </p>
            <button style={styles.ctaButton}>{t('about.ctaButton') || 'Get Started Today'}</button>
          </div>

          {/* Contact Us */}
          <div style={styles.contactSection}>
            <h2 style={styles.sectionTitle}>تواصل معنا</h2>
            <div style={styles.contactGrid}>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>📧</div>
                <p style={styles.contactLabel}>البريد الإلكتروني</p>
                <p style={styles.contactValue}>info@smartlab.com</p>
              </div>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>📞</div>
                <p style={styles.contactLabel}>الهاتف</p>
                <p style={styles.contactValue}>+20 123 456 7890</p>
              </div>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>📍</div>
                <p style={styles.contactLabel}>العنوان</p>
                <p style={styles.contactValue}>القاهرة، مصر</p>
              </div>
            </div>
            
            {/* Map */}
            <div style={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27632.87654321098!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Cairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2s!4v1234567890"
                style={styles.mapIframe}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Syne, "DM Sans", sans-serif',
    color: '#e8f4f0',
    background: 'radial-gradient(circle at top left, rgba(11,206,170,.14), transparent 22%), radial-gradient(circle at top right, rgba(11,206,170,.08), transparent 20%), linear-gradient(180deg, #03111c 0%, #04111e 100%)',
    minHeight: '100vh',
  },

  // Hero
  heroSection: {
    background: `
      linear-gradient(135deg, rgba(2,12,22,0.6) 0%, rgba(4,17,30,0.65) 100%),
      url('/lab-bg.jpg')
    `,
    backgroundSize: '120%',
    backgroundPosition: 'center 30%',
    backgroundRepeat: 'no-repeat',
    color: 'white',
    padding: '140px 20px 150px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1px solid rgba(11,206,170,.08)',
  },

  heroDecor1: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'rgba(11, 206, 170, 0.06)',
    top: '-80px',
    left: '-80px',
    pointerEvents: 'none',
  },

  heroDecor2: {
    position: 'absolute',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'rgba(11, 206, 170, 0.05)',
    bottom: '-60px',
    right: '-50px', 
    pointerEvents: 'none',
  },

  heroDecor3: {
    position: 'absolute',
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    background: 'rgba(11, 206, 170, 0.04)',
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

  badge: {
    display: 'inline-block',
    background: 'rgba(11,206,170,.12)',
    color: '#0bceaa',
    border: '1px solid rgba(11,206,170,.3)',
    padding: '8px 16px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '24px',
  },

  heroTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(36px, 5vw, 52px)',
    fontWeight: '700',
    margin: '0 0 20px 0',
    lineHeight: '1.1',
    letterSpacing: '-1px',
    color: '#effcfb',
  },

  heroSubtitle: {
    fontSize: '18px',
    fontWeight: '400',
    margin: 0,
    opacity: '0.82',
    lineHeight: '1.7',
    maxWidth: '580px',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: 'rgba(232,244,240,.82)',
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

  textBlock: {
    marginBottom: '80px',
    textAlign: 'center',
  },

  sectionTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '32px',
    fontWeight: '600',
    margin: '0 0 20px 0',
    color: '#e8f4f0',
    letterSpacing: '-0.5px',
  },

  paragraph: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: 'rgba(232,244,240,.7)',
    margin: '0 0 16px 0',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  // Stats
  statsSection: {
    marginBottom: '80px',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '700px',
    margin: '0 auto',
  },

  statCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.14)',
    padding: '40px 20px',
    borderRadius: '12px',
    textAlign: 'center',
  },

  statNumber: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '36px',
    fontWeight: '700',
    color: '#0bceaa',
    margin: '0 0 10px 0',
  },

  statLabel: {
    fontSize: '14px',
    color: 'rgba(232,244,240,.7)',
    margin: 0,
  },

  // Features
  featuresSection: {
    marginBottom: '80px',
  },

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    marginTop: '30px',
  },

  featureCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.14)',
    padding: '30px',
    borderRadius: '12px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
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
    color: '#e8f4f0',
  },

  featureDescription: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'rgba(232,244,240,.7)',
    margin: 0,
  },

  // Vision
  visionSection: {
    marginBottom: '80px',
    textAlign: 'center',
    padding: '60px 40px',
    backgroundColor: 'rgba(11,206,170,0.08)',
    borderRadius: '16px',
    border: '1px solid rgba(11,206,170,0.2)',
  },

  // CTA
  ctaSection: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.14)',
    padding: '50px',
    borderRadius: '12px',
    textAlign: 'center',
  },

  ctaText: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: 'rgba(232,244,240,.82)',
    margin: '0 0 30px 0',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  ctaButton: {
    backgroundColor: '#0bceaa',
    color: '#04111e',
    border: 'none',
    padding: '14px 40px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '999px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 12px rgba(11, 206, 170, 0.3)',
  },

  // Contact
  contactSection: {
    marginTop: '80px',
    textAlign: 'center',
  },

  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginTop: '30px',
  },

  contactItem: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(11,206,170,0.14)',
    padding: '30px',
    borderRadius: '12px',
  },

  contactIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },

  contactLabel: {
    fontSize: '14px',
    color: 'rgba(232,244,240,.7)',
    margin: '0 0 8px 0',
  },

  contactValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#e8f4f0',
    margin: 0,
  },

  // Map
  mapContainer: {
    marginTop: '40px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(11,206,170,0.14)',
  },

  mapIframe: {
    width: '100%',
    height: '400px',
    border: 'none',
  },
};

// Hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .featureCard:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(11, 206, 170, 0.15);
  }
  
  button:hover {
    background-color: #09b99a !important;
    transform: translateY(-2px) !important;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 36px !important;
    }
    
    .statsGrid {
      grid-template-columns: 1fr !important;
    }
  }
`;
if (document.head) {
  document.head.appendChild(styleSheet);
}

export default AboutPage;
