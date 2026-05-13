'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const dashboardHref = user?.role === 'lar' ? '/dashboard/lar' : '/dashboard/voluntario'

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
            <>
              <Link href={dashboardHref} className="nav-link">Painel</Link>
              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Sair
              </button>
            </>
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
