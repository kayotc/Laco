'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'

const HABILIDADES = [
  'Educação', 'Saúde', 'Assistência Social', 'Tecnologia', 'Comunicação',
  'Jurídico', 'Psicologia', 'Música', 'Artes', 'Esporte', 'Culinária', 'Idiomas',
]

const INTERESSES = [
  'Crianças e Adolescentes', 'Idosos', 'Deficiência', 'Saúde Mental',
  'Educação', 'Meio Ambiente', 'Assistência Social', 'Cultura e Arte',
]

const DISPONIBILIDADE = ['Manhã', 'Tarde', 'Noite', 'Fins de semana', 'Qualquer horário']

const CATEGORIAS = [
  'Educação', 'Saúde', 'Assistência Social', 'Idosos', 'Crianças e Adolescentes',
  'Deficiência', 'Meio Ambiente', 'Cultura e Arte', 'Esporte', 'Tecnologia', 'Jurídico', 'Psicologia',
]

const TOTAL_STEPS = 3

function Chip({ label, active, onClick, color = 'coral' }) {
  const bg = active
    ? (color === 'teal' ? 'var(--teal)' : 'var(--coral)')
    : 'transparent'
  const text = active ? 'white' : 'var(--ink-muted)'
  const border = active
    ? (color === 'teal' ? 'var(--teal)' : 'var(--coral)')
    : 'var(--border)'

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontSize: '0.875rem', padding: '8px 18px', borderRadius: 100, fontWeight: 500,
        border: `1.5px solid ${border}`, cursor: 'pointer', transition: 'all 0.15s',
        fontFamily: 'var(--font-body)', background: bg, color: text,
      }}
    >
      {label}
    </button>
  )
}

function InputField({ label, value, onChange, placeholder, type = 'text', maxLength, rows, required }) {
  const [focused, setFocused] = useState(false)
  const accent = 'var(--coral)'
  const style = {
    width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: '0.9rem',
    border: `1.5px solid ${focused ? accent : 'var(--border)'}`,
    background: 'var(--warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
    lineHeight: rows ? 1.6 : undefined, resize: rows ? 'none' : undefined,
  }

  const props = {
    style, value, onChange,
    placeholder: placeholder + (required ? '' : ' (opcional)'),
    maxLength, onFocus: () => setFocused(true), onBlur: () => setFocused(false),
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 5 }}>
        {label}{required && <span style={{ color: 'var(--coral)', marginLeft: 2 }}>*</span>}
      </label>
      {rows ? <textarea rows={rows} {...props} /> : <input type={type} {...props} />}
    </div>
  )
}

export default function OnboardingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user) checkOnboarding()
  }, [user, loading])

  const checkOnboarding = async () => {
    try {
      const endpoint = user.role === 'voluntario' ? '/voluntarios/me/perfil' : '/lares/me/perfil'
      const res = await api.get(endpoint)
      const p = res.data
      const done = user.role === 'voluntario'
        ? (p?.cidade || p?.habilidades?.length > 0)
        : (p?.cidade || p?.cnpj)
      if (done) {
        router.push(user.role === 'lar' ? '/dashboard/lar' : '/dashboard/voluntario')
        return
      }
    } catch {}
    setChecking(false)
  }

  const toggle = (field, value) => {
    const curr = form[field] ?? []
    setForm({ ...form, [field]: curr.includes(value) ? curr.filter(x => x !== value) : [...curr, value] })
  }

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const finish = async () => {
    setSaving(true)
    try {
      const endpoint = user.role === 'voluntario' ? '/voluntarios/me/perfil' : '/lares/me/perfil'
      await api.put(endpoint, form)
      router.push(user.role === 'lar' ? '/dashboard/lar' : '/dashboard/voluntario')
    } catch {
      setSaving(false)
    }
  }

  const isVol = user?.role === 'voluntario'
  const accent = isVol ? 'var(--coral)' : 'var(--teal)'

  const stepLabels = isVol
    ? ['Sobre você', 'Suas habilidades', 'Disponibilidade']
    : ['Dados da instituição', 'Sobre o lar', 'Tipo de apoio']

  const canNext = (() => {
    if (isVol) {
      if (step === 1) return true
      if (step === 2) return (form.habilidades?.length ?? 0) > 0
      if (step === 3) return (form.disponibilidade?.length ?? 0) > 0
    } else {
      if (step === 1) return !!form.cidade?.trim()
      if (step === 2) return !!form.descricao?.trim()
      if (step === 3) return (form.categorias?.length ?? 0) > 0
    }
    return false
  })()

  if (loading || checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--warm)' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${accent}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--warm)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'white' }}>
              <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>Laço</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Configuração do perfil</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[1, 2, 3].map(n => (
              <div
                key={n}
                style={{
                  width: n <= step ? 24 : 8, height: 8, borderRadius: 100, transition: 'all 0.3s',
                  background: n < step ? accent : n === step ? accent : 'var(--border)',
                  opacity: n < step ? 0.4 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--border)', flexShrink: 0 }}>
        <div style={{ height: '100%', background: accent, width: `${(step / TOTAL_STEPS) * 100}%`, transition: 'width 0.4s ease' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2.5rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: 540 }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>{step}</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', fontWeight: 500 }}>
              Passo {step} de {TOTAL_STEPS} — {stepLabels[step - 1]}
            </span>
          </div>

          {/* Card */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem', marginBottom: '1rem' }}>

            {/* ── VOLUNTÁRIO ── */}

            {isVol && step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.2 }}>
                    Olá, {user.nome?.split(' ')[0]}!
                  </h2>
                  <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Vamos completar seu perfil para que os lares possam te encontrar e convidar.
                  </p>
                </div>
                <InputField label="Bio" value={form.bio ?? ''} onChange={e => set('bio', e.target.value)} placeholder="Conte um pouco sobre você e por que quer se voluntariar" rows={3} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <InputField label="Cidade" value={form.cidade ?? ''} onChange={e => set('cidade', e.target.value)} placeholder="Ex.: Recife" />
                  <InputField label="Estado" value={form.estado ?? ''} onChange={e => set('estado', e.target.value.toUpperCase())} placeholder="Ex.: PE" maxLength={2} />
                </div>
              </div>
            )}

            {isVol && step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    O que você sabe fazer?
                  </h2>
                  <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem' }}>
                    Selecione ao menos uma habilidade — os lares filtram voluntários por aqui.
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>Habilidades</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {HABILIDADES.map(h => (
                      <Chip key={h} label={h} active={(form.habilidades ?? []).includes(h)} onClick={() => toggle('habilidades', h)} color="coral" />
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>Causas que me interessam</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {INTERESSES.map(i => (
                      <Chip key={i} label={i} active={(form.interesses ?? []).includes(i)} onClick={() => toggle('interesses', i)} color="teal" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isVol && step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    Quando você pode ajudar?
                  </h2>
                  <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem' }}>
                    Selecione sua disponibilidade para que os lares chamem você na hora certa.
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {DISPONIBILIDADE.map(d => (
                    <Chip key={d} label={d} active={(form.disponibilidade ?? []).includes(d)} onClick={() => toggle('disponibilidade', d)} color="coral" />
                  ))}
                </div>
                <div style={{ background: 'var(--teal-light)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                  <span style={{ fontSize: '1.5rem' }}>🎉</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--teal)', lineHeight: 1.5, fontWeight: 500 }}>
                    Ao terminar, seu perfil ficará ativo e visível para os lares parceiros!
                  </p>
                </div>
              </div>
            )}

            {/* ── LAR ── */}

            {!isVol && step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.2 }}>
                    Vamos configurar seu lar!
                  </h2>
                  <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Preencha os dados da instituição para aparecer na plataforma.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <InputField label="Cidade" required value={form.cidade ?? ''} onChange={e => set('cidade', e.target.value)} placeholder="Ex.: Recife" />
                  <InputField label="Estado" value={form.estado ?? ''} onChange={e => set('estado', e.target.value.toUpperCase())} placeholder="Ex.: PE" maxLength={2} />
                  <InputField label="Telefone" value={form.telefone ?? ''} onChange={e => set('telefone', e.target.value)} placeholder="(81) 99999-9999" />
                  <InputField label="CNPJ" value={form.cnpj ?? ''} onChange={e => set('cnpj', e.target.value)} placeholder="00.000.000/0001-00" />
                </div>
                <InputField label="Endereço" value={form.endereco ?? ''} onChange={e => set('endereco', e.target.value)} placeholder="Rua, número, bairro" />
              </div>
            )}

            {!isVol && step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    Fale sobre sua instituição
                  </h2>
                  <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem' }}>
                    Ajude os voluntários a entenderem a missão do seu lar.
                  </p>
                </div>
                <InputField label="Descrição" required value={form.descricao ?? ''} onChange={e => set('descricao', e.target.value)} placeholder="Conte sobre a história, missão e o impacto do seu lar" rows={4} />
                <InputField label="Área de atuação" value={form.area_atuacao ?? ''} onChange={e => set('area_atuacao', e.target.value)} placeholder="Ex.: Abrigo para crianças em situação de vulnerabilidade" />
                <InputField label="Responsável pelo contato" value={form.responsavel ?? ''} onChange={e => set('responsavel', e.target.value)} placeholder="Nome do responsável" />
              </div>
            )}

            {!isVol && step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    Que tipo de apoio você precisa?
                  </h2>
                  <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem' }}>
                    Isso ajuda os voluntários certos a encontrar sua instituição.
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CATEGORIAS.map(c => (
                    <Chip key={c} label={c} active={(form.categorias ?? []).includes(c)} onClick={() => toggle('categorias', c)} color="teal" />
                  ))}
                </div>
                <div style={{ background: 'var(--teal-light)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--teal)', lineHeight: 1.5, fontWeight: 500 }}>
                    Ao finalizar, seu lar estará pronto para buscar voluntários!
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Navegação */}
          <div style={{ display: 'flex', gap: 10 }}>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                style={{ flex: 1, padding: '13px', borderRadius: 12, fontSize: '0.9rem', fontWeight: 500, border: '1.5px solid var(--border)', background: 'var(--white)', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                ← Voltar
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={() => { if (canNext) setStep(s => s + 1) }}
                disabled={!canNext}
                style={{ flex: 2, padding: '13px', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: canNext ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', background: canNext ? accent : '#e5e7eb', color: canNext ? 'white' : '#9ca3af', transition: 'background 0.15s' }}
              >
                Continuar →
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                disabled={!canNext || saving}
                style={{ flex: 2, padding: '13px', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: (canNext && !saving) ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', background: (canNext && !saving) ? accent : '#e5e7eb', color: (canNext && !saving) ? 'white' : '#9ca3af', transition: 'background 0.15s' }}
              >
                {saving ? 'Salvando…' : 'Concluir e acessar o painel →'}
              </button>
            )}
          </div>

          {step === 1 && (
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
              Pode completar depois nas configurações do perfil.{' '}
              <button
                type="button"
                onClick={finish}
                disabled={saving}
                style={{ color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--font-body)', textDecoration: 'underline' }}
              >
                Pular por agora
              </button>
            </p>
          )}

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
