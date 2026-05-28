'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'

const HABILIDADES_OPCOES = [
  'Educação', 'Saúde', 'Assistência Social', 'Tecnologia', 'Comunicação',
  'Jurídico', 'Psicologia', 'Música', 'Artes', 'Esporte', 'Culinária', 'Idiomas',
]
const INTERESSES_OPCOES = [
  'Crianças e Adolescentes', 'Idosos', 'Deficiência', 'Saúde Mental',
  'Educação', 'Meio Ambiente', 'Assistência Social', 'Cultura e Arte',
]
const DISPONIBILIDADE_OPCOES = ['Manhã', 'Tarde', 'Noite', 'Fins de semana', 'Qualquer horário']

/* ── Helpers ── */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [toast, onClose])
  if (!toast) return null
  return <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>{toast.msg}</div>
}

function Chip({ label, active, onClick, color = 'coral' }) {
  const ACTIVE = { coral: { background: 'var(--coral)', color: 'white' }, teal: { background: 'var(--teal)', color: 'white' } }
  const OFF = { background: 'var(--warm)', color: 'var(--ink-muted)', border: '1px solid var(--border)' }
  return (
    <button onClick={onClick} style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: 100, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-body)', ...(active ? ACTIVE[color] : OFF) }}>
      {label}
    </button>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem 1.5rem' }}>
      <h3 style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ink)', marginBottom: '1rem' }}>{title}</h3>
      {children}
    </div>
  )
}

/* ── Estrelas de avaliação ── */
function Estrelas({ nota, onChange, readonly = false }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => !readonly && onChange && onChange(n)}
          onMouseEnter={() => !readonly && setHover(n)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{ fontSize: '1.25rem', background: 'none', border: 'none', cursor: readonly ? 'default' : 'pointer', padding: 0, lineHeight: 1, color: n <= (hover || nota) ? '#f59e0b' : '#d1d5db', transition: 'color 0.1s' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

/* ── Modal de avaliação do lar ── */
function ModalAvaliar({ lar, oportunidade, onClose, onAvaliar }) {
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleEnviar = async () => {
    if (!nota) return
    setEnviando(true)
    try {
      await onAvaliar({ destinatario_id: lar.destinatario_id, oportunidade_id: oportunidade.id, nota, comentario })
      onClose()
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>Avaliar participação</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', marginBottom: '1.25rem' }}>
          {oportunidade.titulo} · {lar.lar_nome}
        </p>
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 8 }}>Sua nota</p>
          <Estrelas nota={nota} onChange={setNota} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 6 }}>Comentário (opcional)</label>
          <textarea rows={3} value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Como foi sua experiência nesta ação?" style={{ width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: '0.875rem', border: '1.5px solid var(--border)', background: 'var(--warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none', resize: 'none', lineHeight: 1.6, boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: '1.25rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, fontSize: '0.875rem', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancelar</button>
          <button onClick={handleEnviar} disabled={!nota || enviando} style={{ flex: 2, padding: '11px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, border: 'none', background: nota ? 'var(--coral)' : '#e5e7eb', color: nota ? 'white' : '#9ca3af', cursor: (!nota || enviando) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)' }}>
            {enviando ? 'Enviando…' : 'Enviar avaliação'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Card de convite ── */
function ConviteCard({ convite, onResponder }) {
  const [respondendo, setRespondendo] = useState(false)
  const responder = async (resposta) => {
    setRespondendo(true)
    try { await onResponder(convite.id, resposta) } catch {}
    finally { setRespondendo(false) }
  }
  const STATUS = {
    pendente: null,
    aceito:   { label: 'Aceito',   bg: 'var(--teal-light)',  color: 'var(--teal)' },
    recusado: { label: 'Recusado', bg: '#fee2e2', color: '#dc2626' },
    expirado: { label: 'Expirado', bg: '#f3f4f6', color: '#6b7280' },
  }
  const s = STATUS[convite.status]
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{convite.lar_nome ?? 'Lar'}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: 2 }}>{new Date(convite.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
        {s && <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>}
      </div>
      {convite.mensagem && <p style={{ fontSize: '0.85rem', color: 'var(--ink)', background: 'var(--warm)', borderRadius: 10, padding: '10px 14px', fontStyle: 'italic', lineHeight: 1.6 }}>"{convite.mensagem}"</p>}
      {convite.status === 'pendente' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => responder('recusado')} disabled={respondendo} style={{ flex: 1, padding: '9px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 500, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Recusar</button>
          <button onClick={() => responder('aceito')} disabled={respondendo} style={{ flex: 1, padding: '9px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, border: 'none', background: 'var(--teal)', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{respondendo ? '…' : 'Aceitar'}</button>
        </div>
      )}
    </div>
  )
}

/* ── Card de oportunidade ── */
function OportunidadeCard({ opp }) {
  const vagasDisponiveis = opp.vagas_totais - (opp.vagas_preenchidas ?? 0)
  const semVagas = vagasDisponiveis <= 0

  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 10, transition: 'transform 0.15s, box-shadow 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.8rem', flexShrink: 0 }}>
            {opp.lar_nome?.[0]?.toUpperCase() ?? 'L'}
          </div>
          <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--ink-muted)' }}>{opp.lar_nome ?? 'Instituição'}</p>
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: opp.presencial ? '#eff6ff' : '#f5f3ff', color: opp.presencial ? '#1d4ed8' : '#6d28d9', flexShrink: 0 }}>
          {opp.presencial ? 'Presencial' : 'Remoto'}
        </span>
      </div>

      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', lineHeight: 1.3 }}>{opp.titulo}</p>

      {opp.descricao && (
        <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{opp.descricao}</p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 9px', borderRadius: 100, background: semVagas ? '#f3f4f6' : '#dcfce7', color: semVagas ? '#6b7280' : '#15803d' }}>
          {semVagas ? 'Vagas encerradas' : `${vagasDisponiveis} vaga${vagasDisponiveis !== 1 ? 's' : ''}`}
        </span>
        {opp.carga_horaria && <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 9px', borderRadius: 100, background: 'var(--warm)', color: 'var(--ink-muted)' }}>{opp.carga_horaria}</span>}
        {opp.categorias?.slice(0, 2).map(c => <span key={c} style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 9px', borderRadius: 100, background: 'var(--teal-light)', color: 'var(--teal)' }}>{c}</span>)}
      </div>

      {opp.presencial && opp.cidade && <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>📍 {opp.cidade}{opp.estado ? `, ${opp.estado}` : ''}</p>}
    </div>
  )
}

/* ── Modal criar grupo (2 passos) ── */
function ModalCriarGrupo({ onClose, onCreate, meuVoluntarioId }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ nome: '', descricao: '' })
  const [criando, setCriando] = useState(false)
  const [grupoId, setGrupoId] = useState(null)
  const [busca, setBusca] = useState('')
  const [voluntarios, setVoluntarios] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [convidados, setConvidados] = useState(new Set())
  const [enviando, setEnviando] = useState(null)

  // carrega lista inicial de voluntários ao entrar no passo 2
  useEffect(() => {
    if (step !== 2) return
    setBuscando(true)
    api.get('/voluntarios?limit=30').then(r => setVoluntarios(r.data?.data ?? [])).catch(() => {}).finally(() => setBuscando(false))
  }, [step])

  const handleCriar = async () => {
    if (!form.nome.trim()) return
    setCriando(true)
    try {
      const grupo = await onCreate(form)
      setGrupoId(grupo?.id ?? null)
      setStep(2)
    } catch {} finally { setCriando(false) }
  }

  const buscarVols = async (q) => {
    setBuscando(true)
    try { const r = await api.get(`/voluntarios?termo=${encodeURIComponent(q)}&limit=20`); setVoluntarios(r.data?.data ?? []) }
    catch {} finally { setBuscando(false) }
  }

  const handleBusca = (v) => {
    setBusca(v)
    if (v.trim()) buscarVols(v)
    else { setBuscando(true); api.get('/voluntarios?limit=30').then(r => setVoluntarios(r.data?.data ?? [])).catch(() => {}).finally(() => setBuscando(false)) }
  }

  const convidar = async (vol) => {
    if (!grupoId) return
    setEnviando(vol.id)
    try {
      await api.post(`/grupos/${grupoId}/convidar`, { convidado_id: vol.id })
      setConvidados(prev => new Set([...prev, vol.id]))
    } catch (err) {
      if (err?.status === 409) setConvidados(prev => new Set([...prev, vol.id]))
    } finally { setEnviando(null) }
  }

  const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>

        {/* cabeçalho com steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>
              {step === 1 ? 'Criar novo grupo' : 'Convidar voluntários'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: 2 }}>
              Passo {step} de 2
            </p>
          </div>
          {step === 2 && <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'var(--teal-light)', color: 'var(--teal)' }}>✓ Grupo criado</span>}
        </div>

        {/* ── PASSO 1: dados do grupo ── */}
        {step === 1 && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Nome do grupo *</label>
                <input type="text" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex.: Voluntários de Educação PE" className="auth-input" style={{ fontSize: '0.875rem' }} autoFocus />
              </div>
              <div>
                <label style={labelStyle}>Descrição (opcional)</label>
                <textarea rows={3} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Do que se trata este grupo?" className="auth-input" style={{ fontSize: '0.875rem', resize: 'none', lineHeight: 1.6 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: '1.25rem' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, fontSize: '0.875rem', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancelar</button>
              <button onClick={handleCriar} disabled={criando || !form.nome.trim()} style={{ flex: 2, padding: '11px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, border: 'none', background: form.nome.trim() ? 'var(--coral)' : '#e5e7eb', color: form.nome.trim() ? 'white' : '#9ca3af', cursor: (!form.nome.trim() || criando) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)' }}>
                {criando ? 'Criando…' : 'Criar e convidar →'}
              </button>
            </div>
          </>
        )}

        {/* ── PASSO 2: convidar voluntários ── */}
        {step === 2 && (
          <>
            <input
              className="auth-input"
              style={{ fontSize: '0.875rem', marginBottom: 10 }}
              placeholder="Buscar voluntário por nome…"
              value={busca}
              onChange={e => handleBusca(e.target.value)}
              autoFocus
            />

            {buscando && <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginBottom: 8 }}>Buscando…</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto', marginBottom: '1rem' }}>
              {voluntarios.filter(v => v.id !== meuVoluntarioId).map(v => {
                const jaConvidado = convidados.has(v.id)
                return (
                  <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'var(--warm)', border: '1px solid var(--border)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: jaConvidado ? 'var(--teal)' : 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.8rem', flexShrink: 0 }}>
                      {v.nome?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.nome}</p>
                      {v.cidade && <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{v.cidade}{v.estado ? `, ${v.estado}` : ''}</p>}
                    </div>
                    <button
                      onClick={() => !jaConvidado && convidar(v)}
                      disabled={jaConvidado || enviando === v.id}
                      style={{ fontSize: '0.75rem', padding: '5px 12px', borderRadius: 8, border: 'none', background: jaConvidado ? '#dcfce7' : 'var(--coral)', color: jaConvidado ? '#15803d' : 'white', cursor: jaConvidado ? 'default' : 'pointer', flexShrink: 0, fontFamily: 'var(--font-body)', fontWeight: 600 }}
                    >
                      {enviando === v.id ? '…' : jaConvidado ? '✓ Convidado' : 'Convidar'}
                    </button>
                  </div>
                )
              })}
              {!buscando && voluntarios.filter(v => v.id !== meuVoluntarioId).length === 0 && (
                <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', textAlign: 'center', padding: '1.5rem 0' }}>Nenhum voluntário encontrado.</p>
              )}
            </div>

            <button onClick={onClose} style={{ width: '100%', padding: '11px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, border: 'none', background: 'var(--teal)', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Concluir {convidados.size > 0 ? `(${convidados.size} convidado${convidados.size > 1 ? 's' : ''})` : ''}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Card de convite de grupo ── */
function GroupConviteCard({ convite, onResponder }) {
  const [respondendo, setRespondendo] = useState(false)
  const responder = async (resposta) => {
    setRespondendo(true)
    try { await onResponder(convite.id, resposta) } catch {}
    finally { setRespondendo(false) }
  }
  const STATUS = {
    aceito:   { label: 'Aceito',   bg: 'var(--teal-light)',  color: 'var(--teal)' },
    recusado: { label: 'Recusado', bg: '#fee2e2', color: '#dc2626' },
  }
  const s = STATUS[convite.status]
  const nomeGrupo = convite.groups?.nome ?? 'Grupo'
  const nomeInvitante = convite.volunteer_profiles?.nome ?? 'Voluntário'
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>👥 {nomeGrupo}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: 2 }}>Convidado por {nomeInvitante} · {new Date(convite.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
        {s && <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>}
      </div>
      {convite.mensagem && <p style={{ fontSize: '0.85rem', color: 'var(--ink)', background: 'var(--warm)', borderRadius: 10, padding: '10px 14px', fontStyle: 'italic', lineHeight: 1.6 }}>"{convite.mensagem}"</p>}
      {convite.status === 'pendente' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => responder('recusado')} disabled={respondendo} style={{ flex: 1, padding: '9px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 500, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Recusar</button>
          <button onClick={() => responder('aceito')} disabled={respondendo} style={{ flex: 1, padding: '9px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, border: 'none', background: 'var(--teal)', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{respondendo ? '…' : 'Aceitar'}</button>
        </div>
      )}
    </div>
  )
}

/* ── Modal convidar voluntário para grupo ── */
function ModalConvidarParaGrupo({ grupo, meuVoluntarioId, onClose }) {
  const [membros, setMembros] = useState([])
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [convidados, setConvidados] = useState(new Set())
  const [enviando, setEnviando] = useState(null)

  useEffect(() => {
    api.get(`/grupos/${grupo.id}/membros`).then(r => setMembros(r ?? [])).catch(() => {})
  }, [grupo.id])

  const buscarVols = async (q) => {
    if (!q.trim()) { setResultados([]); return }
    setBuscando(true)
    try { const r = await api.get(`/voluntarios?termo=${encodeURIComponent(q)}&limit=8`); setResultados(r.data?.data ?? []) }
    catch {} finally { setBuscando(false) }
  }

  const convidar = async (vol) => {
    setEnviando(vol.id)
    try {
      await api.post(`/grupos/${grupo.id}/convidar`, { convidado_id: vol.id })
      setConvidados(prev => new Set([...prev, vol.id]))
    } catch (err) {
      if (err?.status === 409) setConvidados(prev => new Set([...prev, vol.id]))
    } finally {
      setEnviando(null)
    }
  }

  const membroIds = new Set(membros.map(m => m.voluntario_id))
  const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>Convidar voluntários</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginTop: 2 }}>{grupo.nome}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--ink-muted)', padding: 4 }}>✕</button>
        </div>
        <div>
          <p style={labelStyle}>Buscar voluntários</p>
          <input
            className="auth-input"
            style={{ fontSize: '0.875rem', marginBottom: 8 }}
            placeholder="Buscar por nome…"
            value={busca}
            onChange={e => { setBusca(e.target.value); buscarVols(e.target.value) }}
          />
          {buscando && <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginBottom: 6 }}>Buscando…</p>}
          {!busca.trim() && <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', textAlign: 'center', padding: '1.5rem 0' }}>Digite um nome para buscar voluntários.</p>}
          {!buscando && busca.trim() && resultados.length === 0 && <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', textAlign: 'center', padding: '1rem 0' }}>Nenhum voluntário encontrado.</p>}
          {resultados.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {resultados.map(v => {
                const jaMembro = membroIds.has(v.id) || v.id === meuVoluntarioId
                const jaConvidado = convidados.has(v.id)
                return (
                  <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'var(--white)', border: '1px solid var(--border)' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.8rem', flexShrink: 0 }}>{v.nome?.[0]?.toUpperCase() ?? '?'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.nome}</p>
                      {v.cidade && <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{v.cidade}</p>}
                    </div>
                    <button
                      onClick={() => !jaMembro && !jaConvidado && convidar(v)}
                      disabled={jaMembro || jaConvidado || enviando === v.id}
                      style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 8, border: 'none', background: jaMembro ? 'var(--teal-light)' : jaConvidado ? '#dcfce7' : 'var(--coral)', color: jaMembro ? 'var(--teal)' : jaConvidado ? '#15803d' : 'white', cursor: (jaMembro || jaConvidado) ? 'default' : 'pointer', flexShrink: 0, fontFamily: 'var(--font-body)' }}
                    >
                      {enviando === v.id ? '…' : jaMembro ? '✓ Membro' : jaConvidado ? '✓ Convidado' : 'Convidar'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Modal gerenciar grupo (criador) ── */
function ModalGerenciarGrupo({ grupo, onClose, onAtualizar }) {
  const [membros, setMembros] = useState([])
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [removendo, setRemovendo] = useState(null)
  const [adicionando, setAdicionando] = useState(null)

  useEffect(() => {
    api.get(`/grupos/${grupo.id}/membros`).then(r => setMembros(r ?? [])).catch(() => {})
  }, [grupo.id])

  const buscarVols = async (q) => {
    if (!q.trim()) { setResultados([]); return }
    setBuscando(true)
    try { const r = await api.get(`/voluntarios?termo=${encodeURIComponent(q)}&limit=8`); setResultados(r.data?.data ?? []) }
    catch {} finally { setBuscando(false) }
  }

  const remover = async (voluntarioId) => {
    setRemovendo(voluntarioId)
    try { await api.delete(`/grupos/${grupo.id}/membros/${voluntarioId}`); setMembros(m => m.filter(x => x.voluntario_id !== voluntarioId)); onAtualizar() }
    catch {} finally { setRemovendo(null) }
  }

  const adicionar = async (vol) => {
    setAdicionando(vol.id)
    try { await api.post(`/grupos/${grupo.id}/membros`, { voluntario_id: vol.id }); const r = await api.get(`/grupos/${grupo.id}/membros`); setMembros(r ?? []); onAtualizar() }
    catch {} finally { setAdicionando(null) }
  }

  const membroIds = new Set(membros.map(m => m.voluntario_id))
  const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>Gerenciar grupo</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginTop: 2 }}>{grupo.nome}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--ink-muted)', padding: 4 }}>✕</button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={labelStyle}>Membros ({membros.length})</p>
          {membros.length === 0
            ? <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>Nenhum membro ainda.</p>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {membros.map(m => {
                  const v = m.volunteer_profiles
                  return (
                    <div key={m.voluntario_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'var(--warm)', border: '1px solid var(--border)' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.85rem', flexShrink: 0 }}>{v?.nome?.[0]?.toUpperCase() ?? '?'}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v?.nome ?? 'Voluntário'}</p>
                        {v?.cidade && <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{v.cidade}{v.estado ? `, ${v.estado}` : ''}</p>}
                      </div>
                      {v?.habilidades?.slice(0, 2).map(h => <span key={h} style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 100, background: 'var(--coral-light)', color: 'var(--coral-dark)', whiteSpace: 'nowrap' }}>{h}</span>)}
                      <button onClick={() => remover(m.voluntario_id)} disabled={removendo === m.voluntario_id} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff5f5', color: '#dc2626', cursor: 'pointer', flexShrink: 0, fontFamily: 'var(--font-body)' }}>
                        {removendo === m.voluntario_id ? '…' : 'Remover'}
                      </button>
                    </div>
                  )
                })}
              </div>
          }
        </div>

        <div>
          <p style={labelStyle}>Adicionar voluntário</p>
          <input
            className="auth-input"
            style={{ fontSize: '0.875rem', marginBottom: 8 }}
            placeholder="Buscar por nome…"
            value={busca}
            onChange={e => { setBusca(e.target.value); buscarVols(e.target.value) }}
          />
          {buscando && <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginBottom: 6 }}>Buscando…</p>}
          {resultados.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {resultados.map(v => {
                const jaMembro = membroIds.has(v.id)
                return (
                  <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'var(--white)', border: '1px solid var(--border)' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.8rem', flexShrink: 0 }}>{v.nome?.[0]?.toUpperCase() ?? '?'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.nome}</p>
                      {v.cidade && <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{v.cidade}</p>}
                    </div>
                    <button onClick={() => adicionar(v)} disabled={jaMembro || adicionando === v.id} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 8, border: 'none', background: jaMembro ? 'var(--teal-light)' : 'var(--teal)', color: jaMembro ? 'var(--teal)' : 'white', cursor: jaMembro ? 'default' : 'pointer', flexShrink: 0, fontFamily: 'var(--font-body)' }}>
                      {adicionando === v.id ? '…' : jaMembro ? '✓ Membro' : 'Adicionar'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Card de grupo ── */
function GrupoCard({ grupo, membroIds, meuVoluntarioId, onEntrar, onSair, onGerenciar }) {
  const [carregando, setCarregando] = useState(false)
  const sou = membroIds.has(grupo.id)
  const souCriador = grupo.criado_por === meuVoluntarioId
  const toggle = async () => {
    setCarregando(true)
    try { sou && !souCriador ? await onSair(grupo.id) : await onEntrar(grupo.id) } catch {}
    finally { setCarregando(false) }
  }
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>{grupo.nome}</p>
          <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', marginTop: 2 }}>{souCriador ? '👑 Você criou este grupo' : `Criado por ${grupo.volunteer_profiles?.nome ?? 'Voluntário'}`}</p>
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: 'var(--teal-light)', color: 'var(--teal)', flexShrink: 0 }}>
          {grupo.total_membros ?? 0} membro{grupo.total_membros !== 1 ? 's' : ''}
        </span>
      </div>
      {grupo.descricao && <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', lineHeight: 1.5 }}>{grupo.descricao}</p>}
      <div style={{ display: 'flex', gap: 6 }}>
        {souCriador
          ? <button onClick={() => onGerenciar(grupo)} style={{ flex: 1, padding: '9px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, border: 'none', background: 'var(--teal)', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Gerenciar grupo</button>
          : <button onClick={toggle} disabled={carregando} style={{ flex: 1, padding: '9px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, border: sou ? '1.5px solid var(--border)' : 'none', background: sou ? 'transparent' : 'var(--coral)', color: sou ? 'var(--ink-muted)' : 'white', cursor: carregando ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', opacity: carregando ? 0.7 : 1 }}>
              {carregando ? '…' : sou ? 'Sair do grupo' : 'Entrar no grupo'}
            </button>
        }
      </div>
    </div>
  )
}

/* ── Página principal ── */
export default function DashboardVoluntario() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  const [aba, setAba] = useState('grupos')
  const [perfilForm, setPerfilForm] = useState({})
  const [convites, setConvites] = useState([])
  const [oportunidades, setOportunidades] = useState([])
  const [grupos, setGrupos] = useState([])
  const [meusGrupos, setMeusGrupos] = useState([])
  const [convitesGrupo, setConvitesGrupo] = useState([])
  const [modalCriarGrupo, setModalCriarGrupo] = useState(false)
  const [modalGerenciarGrupo, setModalGerenciarGrupo] = useState(null)
  const [modalConvidarParaGrupo, setModalConvidarParaGrupo] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [carregandoOpps, setCarregandoOpps] = useState(false)
  const [filtroPresencial, setFiltroPresencial] = useState(null)
  const [toast, setToast] = useState(null)
  const [modalAvaliar, setModalAvaliar] = useState(null)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && user.role !== 'voluntario') router.push('/dashboard/lar')
  }, [user, loading, router])

  const carregarPerfil = useCallback(async () => {
    try { const res = await api.get('/voluntarios/me/perfil'); setPerfilForm(res.data ?? {}) } catch {}
  }, [])

  const carregarConvites = useCallback(async () => {
    try { const res = await api.get('/convites/recebidos'); setConvites(res.data ?? []) } catch {}
  }, [])

  const carregarGrupos = useCallback(async () => {
    try {
      const [todos, meus] = await Promise.all([api.get('/grupos'), api.get('/grupos/meus')])
      setGrupos(todos.data ?? [])
      setMeusGrupos(meus.data ?? [])
    } catch {}
  }, [])

  const carregarConvitesGrupo = useCallback(async () => {
    try { const res = await api.get('/grupos/convites/recebidos'); setConvitesGrupo(res ?? []) } catch {}
  }, [])

  const carregarOportunidades = useCallback(async () => {
    setCarregandoOpps(true)
    try {
      const params = new URLSearchParams({ status: 'aberta' })
      if (filtroPresencial !== null) params.set('presencial', String(filtroPresencial))
      const res = await api.get(`/oportunidades?${params}`)
      setOportunidades(res.data?.data ?? [])
    } catch { setOportunidades([]) }
    finally { setCarregandoOpps(false) }
  }, [filtroPresencial])

  useEffect(() => {
    if (user) { carregarPerfil(); carregarConvites(); carregarConvitesGrupo(); carregarGrupos() }
  }, [user, carregarPerfil, carregarConvites, carregarGrupos])

  useEffect(() => {
    if (user) carregarOportunidades()
  }, [user, carregarOportunidades])

  const salvar = async () => {
    setSalvando(true)
    try { await api.put('/voluntarios/me/perfil', perfilForm); await carregarPerfil(); showToast('Perfil salvo!') }
    catch (err) { showToast(err.message ?? 'Erro ao salvar.', 'error') }
    finally { setSalvando(false) }
  }

  const responderConvite = async (id, resposta) => {
    try { await api.patch(`/convites/${id}/responder`, { resposta }); carregarConvites(); showToast(resposta === 'aceito' ? 'Convite aceito!' : 'Convite recusado.') }
    catch (err) { showToast(err.message ?? 'Erro.', 'error') }
  }

  const responderConviteGrupo = async (id, resposta) => {
    try {
      await api.patch(`/grupos/convites/${id}/responder`, { resposta })
      carregarConvitesGrupo()
      carregarGrupos()
      showToast(resposta === 'aceito' ? 'Você entrou no grupo!' : 'Convite recusado.')
    } catch (err) { showToast(err.message ?? 'Erro.', 'error') }
  }

  const criarGrupo = async (form) => {
    try {
      const grupo = await api.post('/grupos', form)
      showToast('Grupo criado!')
      await carregarGrupos()
      return grupo
    } catch (err) { showToast(err.message ?? 'Erro ao criar grupo.', 'error'); throw err }
  }

  const entrarGrupo = async (grupoId) => {
    try { await api.post(`/grupos/${grupoId}/entrar`, {}); await carregarGrupos(); showToast('Você entrou no grupo!') }
    catch (err) { showToast(err.message ?? 'Erro.', 'error') }
  }

  const sairGrupo = async (grupoId) => {
    try { await api.delete(`/grupos/${grupoId}/sair`); await carregarGrupos(); showToast('Você saiu do grupo.') }
    catch (err) { showToast(err.message ?? 'Erro.', 'error') }
  }

  const avaliar = async ({ destinatario_id, oportunidade_id, nota, comentario }) => {
    try { await api.post('/avaliacoes', { destinatario_id, oportunidade_id, nota, comentario }); await carregarCandidaturas(); showToast('Avaliação enviada! Obrigado.') }
    catch (err) { showToast(err.message ?? 'Erro ao avaliar.', 'error'); throw err }
  }

  const toggleMulti = (campo, valor) => {
    const atual = perfilForm[campo] ?? []
    setPerfilForm({ ...perfilForm, [campo]: atual.includes(valor) ? atual.filter(x => x !== valor) : [...atual, valor] })
  }

  const pendentes = convites.filter(c => c.status === 'pendente').length
  const pendentesGrupo = convitesGrupo.filter(c => c.status === 'pendente').length
  const totalPendentes = pendentes + pendentesGrupo
  const meusGruposIds = new Set(meusGrupos.map(g => g.id))

  if (loading || !user) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--warm)' }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {modalAvaliar && (
        <ModalAvaliar
          lar={{ destinatario_id: modalAvaliar.oportunidade?.lar_destinatario_id, lar_nome: modalAvaliar.oportunidade?.lar_nome }}
          oportunidade={modalAvaliar.oportunidade}
          onClose={() => setModalAvaliar(null)}
          onAvaliar={avaliar}
        />
      )}
      {modalCriarGrupo && <ModalCriarGrupo onClose={() => setModalCriarGrupo(false)} onCreate={criarGrupo} meuVoluntarioId={perfilForm?.id} />}
      {modalGerenciarGrupo && <ModalGerenciarGrupo grupo={modalGerenciarGrupo} onClose={() => setModalGerenciarGrupo(null)} onAtualizar={carregarGrupos} />}
      {modalConvidarParaGrupo && <ModalConvidarParaGrupo grupo={modalConvidarParaGrupo} meuVoluntarioId={perfilForm?.id} onClose={() => setModalConvidarParaGrupo(null)} />}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: 'var(--coral)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'white' }}><path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" /></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>Laço</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>
              {user.nome?.[0]?.toUpperCase() ?? '?'}
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>{user.nome}</span>
            <button onClick={async () => { await logout(); router.push('/') }} style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: 100, background: 'var(--warm)', color: 'var(--ink-muted)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Sair</button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '1.5rem' }}>

        {/* Abas */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
          {[
            { id: 'grupos', label: 'Grupos' },
            { id: 'meus-grupos', label: 'Meus grupos' },
            { id: 'convites', label: 'Convites', badge: totalPendentes },
            { id: 'perfil', label: 'Meu Perfil' },
          ].map(a => (
            <button
              key={a.id}
              onClick={() => setAba(a.id)}
              style={{ padding: '10px 18px', fontSize: '0.875rem', fontWeight: 500, borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: `2px solid ${aba === a.id ? 'var(--coral)' : 'transparent'}`, color: aba === a.id ? 'var(--coral)' : 'var(--ink-muted)', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: -1, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {a.label}
              {a.badge > 0 && <span style={{ background: 'var(--coral)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '1px 7px', borderRadius: 100 }}>{a.badge}</span>}
            </button>
          ))}
        </div>

        {/* ── ABA: GRUPOS ── */}
        {aba === 'grupos' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>Grupos de voluntários</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: 2 }}>{grupos.length} grupo{grupos.length !== 1 ? 's' : ''} · {meusGrupos.length} que participo</p>
              </div>
              <button onClick={() => setModalCriarGrupo(true)} style={{ padding: '10px 20px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, background: 'var(--coral)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', flexShrink: 0 }}>+ Criar grupo</button>
            </div>
            {grupos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--ink-muted)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>👥</div>
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)', marginBottom: 6 }}>Nenhum grupo ainda</p>
                <p style={{ fontSize: '0.875rem', maxWidth: 320, margin: '0 auto 1.25rem' }}>Crie o primeiro grupo para reunir voluntários com interesses em comum.</p>
                <button onClick={() => setModalCriarGrupo(true)} style={{ padding: '12px 28px', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600, background: 'var(--coral)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Criar grupo</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {grupos.map(g => <GrupoCard key={g.id} grupo={g} membroIds={meusGruposIds} meuVoluntarioId={perfilForm?.id} onEntrar={entrarGrupo} onSair={sairGrupo} onGerenciar={setModalGerenciarGrupo} />)}
              </div>
            )}
          </div>
        )}

        {/* ── ABA: MEUS GRUPOS ── */}
        {aba === 'meus-grupos' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>Meus grupos</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: 2 }}>{meusGrupos.length} grupo{meusGrupos.length !== 1 ? 's' : ''} que participo</p>
              </div>
              <button onClick={() => setModalCriarGrupo(true)} style={{ padding: '10px 20px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, background: 'var(--coral)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', flexShrink: 0 }}>+ Criar grupo</button>
            </div>
            {meusGrupos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--ink-muted)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>👥</div>
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)', marginBottom: 6 }}>Você não participa de nenhum grupo</p>
                <p style={{ fontSize: '0.875rem', maxWidth: 320, margin: '0 auto 1.25rem' }}>Entre em um grupo existente ou crie o seu próprio.</p>
                <button onClick={() => setAba('grupos')} style={{ padding: '12px 28px', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600, background: 'var(--coral)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Explorar grupos</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {meusGrupos.map(g => {
                  const souCriador = g.criado_por === perfilForm?.id
                  return (
                    <div key={g.id} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>{g.nome}</p>
                          <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', marginTop: 2 }}>{souCriador ? '👑 Você criou este grupo' : `Criado por ${g.volunteer_profiles?.nome ?? 'Voluntário'}`}</p>
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: 'var(--teal-light)', color: 'var(--teal)', flexShrink: 0 }}>
                          {g.total_membros ?? 0} membro{g.total_membros !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {g.descricao && <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', lineHeight: 1.5 }}>{g.descricao}</p>}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {souCriador && (
                          <>
                            <button onClick={() => setModalGerenciarGrupo(g)} style={{ flex: 1, padding: '9px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 500, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Gerenciar</button>
                            <button onClick={() => setModalConvidarParaGrupo(g)} style={{ flex: 2, padding: '9px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, border: 'none', background: 'var(--coral)', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Convidar voluntários</button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ABA: CONVITES ── */}
        {aba === 'convites' && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>Convites recebidos</h2>
              {totalPendentes > 0 && <span style={{ background: 'var(--coral)', color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: 100 }}>{totalPendentes} novo{totalPendentes > 1 ? 's' : ''}</span>}
            </div>
            {convites.length === 0 && convitesGrupo.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--ink-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <p style={{ fontWeight: 500, marginBottom: 6 }}>Nenhum convite ainda</p>
                <p style={{ fontSize: '0.85rem' }}>Complete seu perfil e marque-o como visível para ser encontrado pelos lares!</p>
                <button onClick={() => setAba('perfil')} style={{ marginTop: '1rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Completar perfil →</button>
              </div>
            ) : (
              <>
                {convites.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>De lares</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {convites.map(c => <ConviteCard key={c.id} convite={c} onResponder={responderConvite} />)}
                    </div>
                  </div>
                )}
                {convitesGrupo.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Para grupos</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {convitesGrupo.map(c => <GroupConviteCard key={c.id} convite={c} onResponder={responderConviteGrupo} />)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── ABA: PERFIL ── */}
        {aba === 'perfil' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 700 }}>
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {user.nome?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>{user.nome}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: 2 }}>Voluntário · {user.email}</p>
              </div>
            </div>

            <Section title="Informações pessoais">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[{ label: 'Nome', field: 'nome' }, { label: 'Cidade', field: 'cidade' }, { label: 'Estado (UF)', field: 'estado', placeholder: 'Ex.: PE' }].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label className="auth-label">{label}</label>
                    <input type="text" value={perfilForm[field] ?? ''} onChange={e => setPerfilForm({ ...perfilForm, [field]: e.target.value })} placeholder={placeholder ?? ''} className="auth-input" style={{ fontSize: '0.875rem' }} />
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="auth-label">Bio</label>
                  <textarea rows={3} value={perfilForm.bio ?? ''} onChange={e => setPerfilForm({ ...perfilForm, bio: e.target.value })} className="auth-input" style={{ fontSize: '0.875rem', resize: 'none', lineHeight: 1.6 }} />
                </div>
              </div>
            </Section>

            <Section title="Habilidades">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {HABILIDADES_OPCOES.map(h => <Chip key={h} label={h} active={(perfilForm.habilidades ?? []).includes(h)} onClick={() => toggleMulti('habilidades', h)} color="coral" />)}
              </div>
            </Section>

            <Section title="Causas de interesse">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {INTERESSES_OPCOES.map(i => <Chip key={i} label={i} active={(perfilForm.interesses ?? []).includes(i)} onClick={() => toggleMulti('interesses', i)} color="teal" />)}
              </div>
            </Section>

            <Section title="Disponibilidade">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DISPONIBILIDADE_OPCOES.map(d => <Chip key={d} label={d} active={(perfilForm.disponibilidade ?? []).includes(d)} onClick={() => toggleMulti('disponibilidade', d)} color="coral" />)}
              </div>
            </Section>

            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--ink)' }}>Visível para os lares</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginTop: 2 }}>Seu perfil aparece nas buscas dos lares parceiros</p>
              </div>
              <button onClick={() => setPerfilForm({ ...perfilForm, visivel: !perfilForm.visivel })} style={{ position: 'relative', width: 44, height: 24, borderRadius: 100, border: 'none', cursor: 'pointer', background: perfilForm.visivel ? 'var(--coral)' : '#d1d5db', transition: 'background 0.2s', flexShrink: 0 }} aria-label="Alternar visibilidade">
                <span style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', left: perfilForm.visivel ? 23 : 3 }} />
              </button>
            </div>

            <button onClick={salvar} disabled={salvando} style={{ padding: '13px 32px', borderRadius: 12, fontWeight: 500, fontSize: '0.9rem', background: 'var(--coral)', color: 'white', border: 'none', cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? 0.8 : 1, fontFamily: 'var(--font-body)', alignSelf: 'flex-start' }}>
              {salvando ? 'Salvando…' : 'Salvar perfil'}
            </button>
          </div>
        )}

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
