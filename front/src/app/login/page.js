'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

const DEPOIMENTOS = [
  { texto: 'Encontrei o lar perfeito para oferecer minhas aulas de reforço. A plataforma foi essencial.', nome: 'Ana Paula', role: 'Professora voluntária' },
  { texto: 'Em menos de uma semana tínhamos 3 voluntários dispostos a ajudar nossas crianças.', nome: 'Irmã Fátima', role: 'Lar Casa Esperança' },
]

export default function LoginPage() {
  const { login, user, loading } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [depoIdx, setDepoIdx] = useState(0)

  useEffect(() => {
    if (!loading && user) {
      router.push(user.role === 'lar' ? '/dashboard/lar' : '/dashboard/voluntario')
    }
  }, [user, loading, router])

  useEffect(() => {
    const t = setInterval(() => setDepoIdx((i) => (i + 1) % DEPOIMENTOS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const { user: u } = await login(form.email, form.senha)
      router.push(u.role === 'lar' ? '/dashboard/lar' : '/dashboard/voluntario')
    } catch (err) {
      setErro(err.message ?? 'Verifique suas credenciais e tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  const dep = DEPOIMENTOS[depoIdx]

  return (
    <div className="auth-layout">

      {/* ── PAINEL ESQUERDO – Marca ── */}
      <div className="auth-brand">
        <div className="auth-brand-circle c1" />
        <div className="auth-brand-circle c2" />

        <div className="auth-brand-content">
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '3rem' }}>
            <div style={{ width: 36, height: 36, background: 'var(--coral)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'white' }}>
                <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--ink)', fontWeight: 700 }}>Laço</span>
          </Link>

          <p style={{ fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: '0.75rem' }}>
            Lares de Acolhimento Conectados Online
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 3vw, 2.6rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem' }}>
            Conectando corações a <em style={{ color: 'var(--coral)', fontStyle: 'normal' }}>lares</em> que precisam de ajuda
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 400 }}>
            A plataforma que une voluntários comprometidos com lares de acolhimento em todo o Brasil.
          </p>

          {/* Estatísticas */}
          <div style={{ display: 'flex', gap: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', marginBottom: '2.5rem' }}>
            {[
              { num: '1.200+', label: 'Voluntários' },
              { num: '90+', label: 'Lares parceiros' },
              { num: '3.400+', label: 'Conexões feitas' },
            ].map((s) => (
              <div key={s.label}>
                <div className="auth-stat-num">{s.num}</div>
                <div className="auth-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Depoimento rotativo */}
          <div style={{ background: 'white', borderRadius: 16, padding: '1.25rem', border: '1px solid var(--border)', transition: 'all 0.5s' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '0.75rem', fontStyle: 'italic' }}>
              "{dep.texto}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'var(--coral-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--coral)' }}>
                {dep.nome[0]}
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--ink)' }}>{dep.nome}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{dep.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PAINEL DIREITO – Formulário ── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.35rem' }}>
            Bem-vindo de volta
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--ink-muted)', marginBottom: '2rem' }}>
            Entre com suas credenciais para continuar
          </p>

          {erro && (
            <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 12, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.85rem' }}>
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="auth-label">E-mail</label>
              <input
                className="auth-input"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="auth-label">Senha</label>
              <input
                className="auth-input"
                type="password"
                required
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                placeholder="Mínimo 8 caracteres"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="auth-btn-primary" disabled={enviando} style={{ marginTop: 4 }}>
              {enviando ? 'Entrando…' : 'Entrar na plataforma'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--ink-muted)' }}>
            Não tem conta?{' '}
            <Link href="/cadastro" style={{ color: 'var(--coral)', fontWeight: 500, textDecoration: 'none' }}>
              Cadastre-se grátis →
            </Link>
          </p>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: '2rem', paddingTop: '1.5rem', textAlign: 'center' }}>
            <Link href="/" style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', textDecoration: 'none' }}>
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
