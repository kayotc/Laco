'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

function IconGrid() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconChevron({ up }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points={up ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
    </svg>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    router.push('/')
  }

  const dashboardHref = user?.role === 'lar' ? '/dashboard/lar' : '/dashboard/voluntario'

  const displayName = user
    ? user.role === 'voluntario'
      ? `Olá, ${user.nome?.split(' ')[0] ?? 'Voluntário'}`
      : user.nome ?? 'Lar'
    : null

  const avatarLetter = user?.nome?.[0]?.toUpperCase() ?? '?'
  const avatarBg = user?.role === 'lar' ? 'var(--teal)' : 'var(--coral)'

  return (
    <nav>
      <div className="nav-inner">
        <Link href="/" className="logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24">
              <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" />
            </svg>
          </div>
          Laço
        </Link>

        <div className="nav-links">
          <a href="#como" className="nav-link">Como funciona</a>
          <a href="#voluntarios" className="nav-link">Voluntários</a>
          <a href="#lares" className="nav-link">Para lares</a>

          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button onClick={() => setOpen(o => !o)} className="user-pill">
                <div className="user-avatar" style={{ background: avatarBg }}>{avatarLetter}</div>
                <span className="user-pill-name">{displayName}</span>
                <IconChevron up={open} />
              </button>

              {open && (
                <div className="user-dropdown">
                  <Link
                    href={dashboardHref}
                    className="dropdown-item"
                    onClick={() => setOpen(false)}
                  >
                    <IconGrid />
                    Meu painel
                  </Link>
                  <div className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item dropdown-item-danger">
                    <IconLogout />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-link">Entrar</Link>
              <Link href="/cadastro" className="nav-link cta">Criar conta</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
