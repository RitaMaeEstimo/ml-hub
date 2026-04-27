// ==========================================
// FILE LOCATION: app/auth/page.js
// PAGE: Login / Sign-Up Page
// ==========================================

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import SakuraPetals from '../../components/SakuraPetals'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const showMessage = (text, error = false) => {
    setMessage(text)
    setIsError(error)
    setTimeout(() => setMessage(null), 5000)
  }

  const handleSignUp = async () => {
    if (!email || !password) return showMessage('Please fill in all fields.', true)
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) return showMessage(error.message, true)
    showMessage('Account created! Check your email to confirm, then log in.')
  }

  const handleLogin = async () => {
    if (!email || !password) return showMessage('Please fill in all fields.', true)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return showMessage(error.message, true)
    router.push('/dashboard')
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: '#0e0303',
    border: '1px solid #2a0808',
    borderRadius: '7px', color: '#f0e0e0',
    fontSize: '15px',
    fontFamily: "'Cormorant Garamond', serif",
    outline: 'none', transition: 'border-color 0.25s',
    letterSpacing: '0.02em',
  }

  return (
    <main style={{
      minHeight: '100vh', background: '#060608',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <SakuraPetals count={18} />

      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -55%)',
        width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(120,10,10,0.2) 0%, transparent 60%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>

        {/* Logo */}
        <div className="fade-up fade-up-1" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center',
            gap: '10px', textDecoration: 'none',
          }}>
            <div style={{
              width: '38px', height: '38px',
              background: 'linear-gradient(135deg, #c0392b, #6b0f0f)',
              borderRadius: '9px',
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
          </Link>
        </div>

        {/* Card */}
        <div className="fade-up fade-up-2" style={{
          background: 'rgba(10,2,2,0.85)',
          border: '1px solid #1e0707',
          borderRadius: '16px', padding: '44px 40px',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '30px', fontWeight: '700',
              color: '#f5eded', marginBottom: '6px',
            }}>Welcome back</h2>
            <p style={{
              color: '#4a3030', fontSize: '14px',
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: '300', letterSpacing: '0.04em',
            }}>Sign in to your account</p>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block', color: '#5a3a3a',
              fontSize: '11px', letterSpacing: '0.12em',
              textTransform: 'uppercase', marginBottom: '8px',
              fontFamily: "'Cormorant Garamond', serif",
            }}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#c0392b'}
              onBlur={e => e.target.style.borderColor = '#2a0808'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block', color: '#5a3a3a',
              fontSize: '11px', letterSpacing: '0.12em',
              textTransform: 'uppercase', marginBottom: '8px',
              fontFamily: "'Cormorant Garamond', serif",
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#c0392b'}
              onBlur={e => e.target.style.borderColor = '#2a0808'}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {/* Message */}
          {message && (
            <div style={{
              background: isError ? 'rgba(100,10,10,0.35)' : 'rgba(10,50,20,0.35)',
              border: `1px solid ${isError ? '#6b0f0f' : '#0f4020'}`,
              borderRadius: '7px', padding: '12px 16px',
              fontSize: '14px',
              color: isError ? '#e07070' : '#70c090',
              marginBottom: '20px', lineHeight: '1.6',
              fontFamily: "'Cormorant Garamond', serif",
            }}>
              {message}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #c0392b, #6b0f0f)',
                color: '#ffeaea', border: 'none', borderRadius: '7px',
                padding: '15px', fontSize: '16px', fontWeight: '600',
                letterSpacing: '0.08em', width: '100%',
                opacity: loading ? 0.6 : 1,
                fontFamily: "'Cormorant Garamond', serif",
                boxShadow: '0 0 28px rgba(192,57,43,0.22)',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Please wait...' : 'Login'}
            </button>

            <button
              onClick={handleSignUp}
              disabled={loading}
              style={{
                background: 'transparent',
                color: '#c0392b',
                border: '1px solid rgba(192,57,43,0.6)',
                borderRadius: '7px',
                padding: '15px', fontSize: '16px', fontWeight: '600',
                letterSpacing: '0.08em', width: '100%',
                opacity: loading ? 0.6 : 1,
                fontFamily: "'Cormorant Garamond', serif",
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Please wait...' : 'Sign Up'}
            </button>
          </div>
        </div>

        <p style={{
          textAlign: 'center', fontSize: '13px',
          marginTop: '24px',
          fontFamily: "'Cormorant Garamond', serif",
        }}>
          <Link href="/" style={{ color: '#4a2a2a', letterSpacing: '0.04em' }}>
            ← Return to Home
          </Link>
        </p>
      </div>
    </main>
  )
}