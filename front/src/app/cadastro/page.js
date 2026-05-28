'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

const ROLES = [
  {
    value: 'voluntario',
    icon: '🤝',
    title: 'Sou Voluntário',
    desc: 'Quero oferecer meu tempo e habilidades para ajudar lares de acolhimento.',
  },
  {
    value: 'lar',
    icon: '🏠',
    title: 'Sou um Lar',
    desc: 'Represento uma instituição que busca voluntários para suas ações.',
  },
]

const BRAND_INFO = {
  voluntario: {
    titulo: 'Faça parte de algo maior',
    descricao: 'Cada hora de voluntariado transforma vidas. Cadastre-se e seja encontrado por lares que precisam exatamente do que você tem a oferecer.',
    passos: [
      { n: '1', txt: 'Crie seu perfil em menos de 2 minutos' },
      { n: '2', txt: 'Defina suas habilidades e disponibilidade' },
      { n: '3', txt: 'Receba convites de lares verificados' },
    ],
    cor: 'var(--coral)',
    corLight: 'var(--coral-light)',
  },
  lar: {
    titulo: 'Encontre o apoio que sua instituição precisa',
    descricao: 'Lares verificados têm acesso a centenas de voluntários prontos para ajudar — com diferentes habilidades, cidades e horários disponíveis.',
    passos: [
      { n: '1', txt: 'Cadastre sua instituição e aguarde verificação' },
      { n: '2', txt: 'Acesse a base completa de voluntários' },
      { n: '3', txt: 'Convide diretamente quem melhor se encaixa' },
    ],
    cor: 'var(--teal)',
    corLight: 'var(--teal-light)',
  },
}

export default function CadastroPage() {
  const { register, user, loading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push(user.role === 'lar' ? '/dashboard/lar' : '/dashboard/voluntario')
    }
  }, [user, loading, router])

  const handleRoleSelect = (r) => { setRole(r); setStep(2) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await register({ ...form, role })
      router.push('/onboarding')
    } catch (err) {
      setErro(err.message ?? 'Erro ao criar conta. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  const info = role ? BRAND_INFO[role] : BRAND_INFO.voluntario

  return (
    <div className="auth-layout">

      {/* ── PAINEL ESQUERDO – Marca ── */}
      <div className="auth-brand">
        <div className="auth-brand-circle c1" style={{ background: role === 'lar' ? 'var(--teal-light)' : 'var(--coral-light)' }} />
        <div className="auth-brand-circle c2" style={{ background: role === 'lar' ? 'var(--teal-light)' : 'var(--coral-light)' }} />

        <div className="auth-brand-content">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '3rem' }}>
            <div style={{ width: 36, height: 36, background: info.cor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }}>
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'white' }}>
                <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--ink)', fontWeight: 700 }}>Laço</span>
          </Link>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25, marginBottom: '1rem', transition: 'all 0.3s' }}>
            {info.titulo}
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 400 }}>
            {info.descricao}
          </p>

          {/* Passos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {info.passos.map((p) => (
              <div key={p.n} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, background: info.cor, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }}>
                  <span style={{ color: 'white', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>{p.n}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 400 }}>{p.txt}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
              Já temos <strong style={{ color: 'var(--ink)' }}>1.200+ voluntários</strong> e{' '}
              <strong style={{ color: 'var(--ink)' }}>90+ lares</strong> conectados no Brasil.
            </p>
          </div>
        </div>
      </div>

      {/* ── PAINEL DIREITO – Formulário ── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">

          {/* STEP 1 — Escolher papel */}
          {step === 1 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.35rem' }}>
                Criar conta
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--ink-muted)', marginBottom: '2rem' }}>
                Como você vai usar o Laço?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleRoleSelect(r.value)}
                    className="auth-role-card"
                  >
                    <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{r.icon}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: 3 }}>{r.title}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', lineHeight: 1.5 }}>{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--ink-muted)' }}>
                Já tem conta?{' '}
                <Link href="/login" style={{ color: 'var(--coral)', fontWeight: 500, textDecoration: 'none' }}>
                  Entrar →
                </Link>
              </p>

              <div style={{ borderTop: '1px solid var(--border)', marginTop: '1.5rem', paddingTop: '1.25rem', textAlign: 'center' }}>
                <Link href="/" style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', textDecoration: 'none' }}>
                  ← Voltar ao início
                </Link>
              </div>
            </>
          )}

          {/* STEP 2 — Preencher dados */}
          {step === 2 && (
            <>
              <button
                onClick={() => { setStep(1); setErro('') }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '1.25rem', fontFamily: 'var(--font-body)' }}
              >
                ← Voltar
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: role === 'lar' ? 'var(--teal-light)' : 'var(--coral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  {role === 'lar' ? '🏠' : '🤝'}
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {role === 'lar' ? 'Cadastro do Lar' : 'Cadastro do Voluntário'}
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>Preencha seus dados para começar</p>
                </div>
              </div>

              {erro && (
                <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 12, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.85rem' }}>
                  {erro}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="auth-label">
                    {role === 'lar' ? 'Nome do Lar / Instituição' : 'Seu nome completo'}
                  </label>
                  <input
                    className="auth-input"
                    type="text"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder={role === 'lar' ? 'Ex.: Casa de Acolhimento Esperança' : 'Ex.: Maria da Silva'}
                    autoComplete="name"
                  />
                </div>
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
                    minLength={8}
                    value={form.senha}
                    onChange={(e) => setForm({ ...form, senha: e.target.value })}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                  />
                </div>

                <button type="submit" className="auth-btn-primary" disabled={enviando} style={{ marginTop: 4, background: role === 'lar' ? 'var(--teal)' : 'var(--coral)' }}>
                  {enviando ? 'Criando conta…' : 'Criar minha conta'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--ink-muted)' }}>
                Já tem conta?{' '}
                <Link href="/login" style={{ color: 'var(--coral)', fontWeight: 500, textDecoration: 'none' }}>
                  Entrar →
                </Link>
              </p>
              
              <p style={{ textAlign: 'center', marginTop: '.25rem', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                Ao criar conta você concorda com nossos{' '}
                <span style={{ color: 'var(--coral)' }}>Termos de Uso</span>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
