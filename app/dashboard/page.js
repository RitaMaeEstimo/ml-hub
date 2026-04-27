// ==========================================
// FILE LOCATION: app/dashboard/page.js
// PAGE: Dashboard (shown after login)
// ==========================================

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import SakuraPetals from '../../components/SakuraPetals'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/auth')
      else { setUser(data.user); setLoading(false) }
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <main style={{
      minHeight: '100vh', background: '#060608',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        color: '#3a1010', fontSize: '12px',
        letterSpacing: '0.2em',
        fontFamily: "'Cormorant Garamond', serif",
        textTransform: 'uppercase',
      }}>Loading...</div>
    </main>
  )

  return (
    <main style={{
      minHeight: '100vh', background: '#060608',
      padding: '40px 24px', position: 'relative',
    }}>
      <SakuraPetals count={16} />

      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(140,10,10,0.18) 0%, transparent 65%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '52px', paddingBottom: '24px',
          borderBottom: '1px solid #1e0707',
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

          <button onClick={handleLogout} style={{
            background: 'transparent', color: '#4a3030',
            border: '1px solid #1e0707', borderRadius: '6px',
            padding: '10px 22px', fontSize: '14px',
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: '0.06em',
          }}>
            Sign Out
          </button>
        </div>

        {/* Welcome banner */}
        <div style={{
          background: 'rgba(10,2,2,0.7)',
          border: '1px solid #1e0707',
          borderRadius: '14px', padding: '44px 48px',
          marginBottom: '28px',
          backdropFilter: 'blur(10px)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', bottom: '-60px', right: '-60px',
            width: '260px', height: '260px',
            background: 'radial-gradient(circle, rgba(192,57,43,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            border: '1px solid rgba(160,30,30,0.3)',
            borderRadius: '3px', padding: '4px 12px',
            fontSize: '10px', letterSpacing: '0.14em',
            color: '#6a2a2a', marginBottom: '18px',
            fontFamily: "'Cormorant Garamond', serif",
            textTransform: 'uppercase',
          }}>
            Dashboard
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '38px', fontWeight: '700',
            color: '#f5eded', marginBottom: '10px',
          }}>
            Welcome back.
          </h1>
          <p style={{
            color: '#4a3030', fontSize: '16px',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: '300',
          }}>
            Signed in as{' '}
            <span style={{ color: '#c0392b', fontWeight: '400' }}>{user?.email}</span>
          </p>
        </div>

        {/* Stat cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {[
            { title: 'My Courses',  value: '3 enrolled',   symbol: '✦' },
            { title: 'Progress',    value: '42% complete', symbol: '◈' },
            { title: 'Community',   value: '12 posts',     symbol: '◎' },
          ].map(({ symbol, title, value }) => (
            <div key={title} style={{
              background: 'rgba(10,2,2,0.7)',
              border: '1px solid #1e0707',
              borderRadius: '12px', padding: '28px',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{
                color: '#c0392b', fontSize: '18px',
                marginBottom: '14px', opacity: 0.6,
              }}>{symbol}</div>
              <div style={{
                color: '#3a1a1a', fontSize: '11px',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                marginBottom: '6px',
                fontFamily: "'Cormorant Garamond', serif",
              }}>{title}</div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '24px', color: '#f5eded', fontWeight: '700',
              }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}