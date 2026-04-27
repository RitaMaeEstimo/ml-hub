// ==========================================
// FILE LOCATION: app/page.js
// PAGE: Landing Page
// ==========================================

'use client'
import Link from 'next/link'
import SakuraPetals from '../components/SakuraPetals'

const TOPICS = [
  {
    label: 'Deep Learning',
    desc: 'Neural networks, CNNs, RNNs, transformers, and beyond.',
    tag: 'Foundation',
  },
  {
    label: 'Natural Language Processing',
    desc: 'Text classification, sentiment analysis, and large language models.',
    tag: 'Advanced',
  },
  {
    label: 'Computer Vision',
    desc: 'Image recognition, object detection, and generative models.',
    tag: 'Advanced',
  },
  {
    label: 'Reinforcement Learning',
    desc: 'Agents, reward systems, and policy optimization.',
    tag: 'Intermediate',
  },
  {
    label: 'MLOps & Deployment',
    desc: 'Model pipelines, monitoring, and production best practices.',
    tag: 'Practical',
  },
  {
    label: 'Data Science Fundamentals',
    desc: 'Statistics, data wrangling, and exploratory analysis.',
    tag: 'Foundation',
  },
]

const TAG_COLORS = {
  Foundation:   { bg: 'rgba(192,57,43,0.12)',  color: '#c0392b' },
  Intermediate: { bg: 'rgba(180,100,30,0.12)', color: '#b46a1e' },
  Advanced:     { bg: 'rgba(100,20,80,0.15)',  color: '#a040a0' },
  Practical:    { bg: 'rgba(20,90,60,0.15)',   color: '#1a8a5a' },
}

export default function LandingPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#060608',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <SakuraPetals count={20} />

      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '560px', height: '560px',
        background: 'radial-gradient(circle, rgba(140,10,10,0.2) 0%, transparent 65%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '28px 56px',
        position: 'relative', zIndex: 10,
        borderBottom: '1px solid rgba(30,7,7,0.8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #c0392b, #6b0f0f)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="2" fill="#ffd6d6"/>
              <circle cx="6" cy="1.5" r="1.5" fill="#ffd6d6"/>
              <circle cx="6" cy="10.5" r="1.5" fill="#ffd6d6"/>
              <circle cx="1.5" cy="6" r="1.5" fill="#ffd6d6"/>
              <circle cx="10.5" cy="6" r="1.5" fill="#ffd6d6"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: '600', fontSize: '17px',
            letterSpacing: '0.18em', color: '#f0e8e8',
          }}>ML HUB</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/auth" style={{
            color: '#4a3030', fontSize: '15px',
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: '0.06em',
          }}>Sign in</Link>
          <Link href="/auth" style={{
            background: 'linear-gradient(135deg, #c0392b, #6b0f0f)',
            color: '#ffeaea', borderRadius: '6px',
            padding: '10px 24px', fontSize: '15px', fontWeight: '600',
            letterSpacing: '0.06em', textDecoration: 'none',
            fontFamily: "'Cormorant Garamond', serif",
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: '700px', margin: '0 auto',
        padding: '88px 56px 64px',
        position: 'relative', zIndex: 10,
        textAlign: 'center',
      }}>
        <div className="fade-up fade-up-1" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          border: '1px solid rgba(160,30,30,0.35)',
          borderRadius: '3px', padding: '5px 14px',
          fontSize: '11px', letterSpacing: '0.14em',
          color: '#8a3030', marginBottom: '28px',
          fontFamily: "'Cormorant Garamond', serif",
          textTransform: 'uppercase',
        }}>
          Artificial Intelligence · Machine Learning
        </div>

        <h1 className="fade-up fade-up-2" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(42px, 7vw, 76px)',
          fontWeight: '700', lineHeight: '1.1',
          color: '#f5eded', marginBottom: '10px',
        }}>
          Machine
        </h1>
        <h1 className="fade-up fade-up-2" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(42px, 7vw, 76px)',
          fontWeight: '700', lineHeight: '1.1',
          fontStyle: 'italic',
          background: 'linear-gradient(135deg, #c0392b 0%, #e07070 60%, #f5b8b8 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '28px',
        }}>
          Learning Hub
        </h1>

        <p className="fade-up fade-up-3" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: '300', fontSize: '19px',
          lineHeight: '1.85', color: '#5a3a3a',
          marginBottom: '44px',
        }}>
          A curated platform for learning machine learning —
          from foundational theory to production-ready deployment.
        </p>

        <div className="fade-up fade-up-4" style={{
          display: 'flex', gap: '14px',
          justifyContent: 'center', flexWrap: 'wrap',
        }}>
          <Link href="/auth" style={{
            background: 'linear-gradient(135deg, #c0392b, #6b0f0f)',
            color: '#ffeaea', borderRadius: '6px',
            padding: '16px 44px', fontSize: '16px', fontWeight: '600',
            letterSpacing: '0.06em', textDecoration: 'none',
            fontFamily: "'Cormorant Garamond', serif",
            boxShadow: '0 0 40px rgba(192,57,43,0.25)',
          }}>
            Begin Learning
          </Link>
          <Link href="/auth" style={{
            background: 'transparent', color: '#5a3030',
            border: '1px solid #2a0808', borderRadius: '6px',
            padding: '16px 44px', fontSize: '16px', fontWeight: '400',
            letterSpacing: '0.06em', textDecoration: 'none',
            fontFamily: "'Cormorant Garamond', serif",
          }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Topic Paths */}
      <section style={{
        maxWidth: '1000px', margin: '0 auto',
        padding: '0 56px 80px',
        position: 'relative', zIndex: 10,
      }}>
        <p className="fade-up fade-up-5" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '12px', letterSpacing: '0.16em',
          color: '#3a1a1a', textTransform: 'uppercase',
          marginBottom: '20px', textAlign: 'center',
        }}>
          Learning Paths
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
        }}>
          {TOPICS.map(({ label, desc, tag }) => {
            const tagStyle = TAG_COLORS[tag] || TAG_COLORS.Foundation
            return (
              <div key={label} style={{
                background: 'rgba(10,2,2,0.65)',
                border: '1px solid #1e0707',
                borderRadius: '10px',
                padding: '22px 24px',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '10px',
                }}>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '17px', color: '#f0e0e0',
                    fontWeight: '700', lineHeight: '1.3',
                    flex: 1, marginRight: '10px',
                  }}>{label}</h3>
                  <span style={{
                    background: tagStyle.bg,
                    color: tagStyle.color,
                    fontSize: '10px', borderRadius: '3px',
                    padding: '3px 8px', letterSpacing: '0.08em',
                    fontFamily: "'Cormorant Garamond', serif",
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>{tag}</span>
                </div>
                <p style={{
                  color: '#4a2a2a', fontSize: '14px',
                  lineHeight: '1.65',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: '300',
                }}>{desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        borderTop: '1px solid #1a0505',
        padding: '44px 56px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '20px',
        position: 'relative', zIndex: 10,
      }}>
        <div>
          <h4 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '22px', color: '#f0e0e0',
            fontWeight: '700', marginBottom: '4px',
          }}>Ready to start?</h4>
          <p style={{
            color: '#3a1a1a', fontSize: '14px',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: '300',
          }}>Create a free account and begin your first learning path today.</p>
        </div>
        <Link href="/auth" style={{
          background: 'linear-gradient(135deg, #c0392b, #6b0f0f)',
          color: '#ffeaea', borderRadius: '6px',
          padding: '14px 36px', fontSize: '15px', fontWeight: '600',
          letterSpacing: '0.06em', textDecoration: 'none',
          fontFamily: "'Cormorant Garamond', serif",
          whiteSpace: 'nowrap',
        }}>
          Create Account →
        </Link>
      </section>
    </main>
  )
}