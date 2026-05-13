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
function OportunidadeCard({ opp, candidatura, onCandidatar }) {
  const [candidatando, setCandidatando] = useState(false)
  const vagasDisponiveis = opp.vagas_totais - (opp.vagas_preenchidas ?? 0)
  const semVagas = vagasDisponiveis <= 0

  const STATUS_CAND = {
    pendente:  { label: 'Candidatura enviada', bg: '#fef9c3', color: '#854d0e' },
    aprovado:  { label: 'Aprovado!', bg: 'var(--teal-light)', color: 'var(--teal)' },
    rejeitado: { label: 'Não aprovado', bg: '#fee2e2', color: '#dc2626' },
    retirado:  { label: 'Retirado', bg: '#f3f4f6', color: '#6b7280' },
  }

  const handleCandidatar = async () => {
    setCandidatando(true)
    try { await onCandidatar(opp.id) } catch {}
    finally { setCandidatando(false) }
  }

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

      {candidatura ? (
        <span style={{ fontSize: '0.8rem', fontWeight: 500, padding: '8px 14px', borderRadius: 10, textAlign: 'center', background: (STATUS_CAND[candidatura.status] ?? STATUS_CAND.pendente).bg, color: (STATUS_CAND[candidatura.status] ?? STATUS_CAND.pendente).color }}>
          {(STATUS_CAND[candidatura.status] ?? STATUS_CAND.pendente).label}
        </span>
      ) : (
        <button
          onClick={handleCandidatar}
          disabled={candidatando || semVagas}
          style={{ padding: '9px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: (candidatando || semVagas) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', background: semVagas ? '#f3f4f6' : 'var(--coral)', color: semVagas ? '#6b7280' : 'white', transition: 'opacity 0.15s', opacity: candidatando ? 0.7 : 1 }}
        >
          {candidatando ? 'Enviando…' : semVagas ? 'Sem vagas' : 'Candidatar-se'}
        </button>
      )}
    </div>
  )
}

/* ── Card de candidatura (aba minhas candidaturas) ── */
function CandidaturaCard({ candidatura, user, onAvaliar }) {
  const opp = candidatura.oportunidade
  const STATUS = {
    pendente:  { label: 'Aguardando resposta', bg: '#fef9c3', color: '#854d0e' },
    aprovado:  { label: 'Aprovado', bg: 'var(--teal-light)', color: 'var(--teal)' },
    rejeitado: { label: 'Não aprovado', bg: '#fee2e2', color: '#dc2626' },
    retirado:  { label: 'Retirado', bg: '#f3f4f6', color: '#6b7280' },
  }
  const s = STATUS[candidatura.status] ?? STATUS.pendente
  const podeAvaliar = candidatura.status === 'aprovado' && opp?.status === 'concluida'

  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{opp?.titulo ?? 'Oportunidade'}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: 2 }}>{opp?.lar_nome}</p>
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: s.bg, color: s.color, flexShrink: 0, whiteSpace: 'nowrap' }}>{s.label}</span>
      </div>
      {opp?.cidade && <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>📍 {opp.cidade}{opp.presencial ? ' · Presencial' : ' · Remoto'}</p>}
      <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>Candidatura em {new Date(candidatura.criado_em).toLocaleDateString('pt-BR')}</p>
      {podeAvaliar && (
        <button
          onClick={() => onAvaliar(candidatura)}
          style={{ padding: '9px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, border: '1.5px solid var(--coral)', background: 'transparent', color: 'var(--coral)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
        >
          ★ Avaliar participação
        </button>
      )}
    </div>
  )
}

/* ── Página principal ── */
export default function DashboardVoluntario() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  const [aba, setAba] = useState('oportunidades')
  const [perfilForm, setPerfilForm] = useState({})
  const [convites, setConvites] = useState([])
  const [oportunidades, setOportunidades] = useState([])
  const [candidaturas, setCandidaturas] = useState([])
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

  const carregarCandidaturas = useCallback(async () => {
    try { const res = await api.get('/voluntarios/me/candidaturas'); setCandidaturas(res.data ?? []) } catch {}
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
    if (user) { carregarPerfil(); carregarConvites(); carregarCandidaturas() }
  }, [user, carregarPerfil, carregarConvites, carregarCandidaturas])

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

  const candidatar = async (oppId) => {
    try { await api.post(`/oportunidades/${oppId}/candidatar`, {}); await carregarCandidaturas(); showToast('Candidatura enviada!') }
    catch (err) { showToast(err.message ?? 'Erro ao candidatar.', 'error') }
  }

  const avaliar = async ({ destinatario_id, oportunidade_id, nota, comentario }) => {
    try { await api.post('/avaliacoes', { destinatario_id, oportunidade_id, nota, comentario }); await carregarCandidaturas(); showToast('Avaliação enviada! Obrigado.') }
    catch (err) { showToast(err.message ?? 'Erro ao avaliar.', 'error'); throw err }
  }

  const toggleMulti = (campo, valor) => {
    const atual = perfilForm[campo] ?? []
    setPerfilForm({ ...perfilForm, [campo]: atual.includes(valor) ? atual.filter(x => x !== valor) : [...atual, valor] })
  }

  // Mapa de candidaturas por oportunidade para lookup rápido
  const candPorOpp = Object.fromEntries(candidaturas.map(c => [c.oportunidade_id, c]))
  const pendentes = convites.filter(c => c.status === 'pendente').length
  const candPendentes = candidaturas.filter(c => c.status === 'pendente').length

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
            { id: 'oportunidades', label: 'Oportunidades' },
            { id: 'candidaturas', label: 'Minhas Candidaturas', badge: candPendentes },
            { id: 'convites', label: 'Convites', badge: pendentes },
            { id: 'perfil', label: 'Meu Perfil' },
          ].map(a => (
            <button
              key={a.id}
              onClick={() => setAba(a.id)}
              style={{ padding: '10px 18px', fontSize: '0.875rem', fontWeight: 500, borderBottom: `2px solid ${aba === a.id ? 'var(--coral)' : 'transparent'}`, color: aba === a.id ? 'var(--coral)' : 'var(--ink-muted)', background: 'none', border: 'none', borderBottom: `2px solid ${aba === a.id ? 'var(--coral)' : 'transparent'}`, cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: -1, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {a.label}
              {a.badge > 0 && <span style={{ background: 'var(--coral)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '1px 7px', borderRadius: 100 }}>{a.badge}</span>}
            </button>
          ))}
        </div>

        {/* ── ABA: OPORTUNIDADES ── */}
        {aba === 'oportunidades' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>Oportunidades disponíveis</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: 2 }}>
                  {carregandoOpps ? 'Carregando…' : `${oportunidades.length} oportunidade${oportunidades.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[{ label: 'Todas', value: null }, { label: 'Presencial', value: true }, { label: 'Remoto', value: false }].map(({ label, value }) => (
                  <button key={label} onClick={() => setFiltroPresencial(value)} style={{ fontSize: '0.8rem', padding: '7px 14px', borderRadius: 100, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', background: filtroPresencial === value ? 'var(--ink)' : 'var(--white)', color: filtroPresencial === value ? 'white' : 'var(--ink-muted)', border: `1px solid ${filtroPresencial === value ? 'var(--ink)' : 'var(--border)'}` }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {carregandoOpps ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--coral)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : oportunidades.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--ink-muted)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔎</div>
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)', marginBottom: 6 }}>Nenhuma oportunidade no momento</p>
                <p style={{ fontSize: '0.875rem', maxWidth: 320, margin: '0 auto' }}>Complete seu perfil e fique visível para receber convites dos lares parceiros.</p>
                <button onClick={() => setAba('perfil')} style={{ marginTop: '1.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Completar perfil →</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {oportunidades.map(opp => (
                  <OportunidadeCard key={opp.id} opp={opp} candidatura={candPorOpp[opp.id]} onCandidatar={candidatar} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ABA: CANDIDATURAS ── */}
        {aba === 'candidaturas' && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>Minhas Candidaturas</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>{candidaturas.length} no total</span>
            </div>

            {candidaturas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--ink-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                <p style={{ fontWeight: 500, marginBottom: 6 }}>Nenhuma candidatura ainda</p>
                <p style={{ fontSize: '0.85rem' }}>Navegue pelas oportunidades e candidate-se às que interessar!</p>
                <button onClick={() => setAba('oportunidades')} style={{ marginTop: '1rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Ver oportunidades →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {candidaturas.map(c => (
                  <CandidaturaCard
                    key={c.id}
                    candidatura={c}
                    user={user}
                    onAvaliar={cand => setModalAvaliar(cand)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ABA: CONVITES ── */}
        {aba === 'convites' && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>Convites recebidos</h2>
              {pendentes > 0 && <span style={{ background: 'var(--coral)', color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: 100 }}>{pendentes} novo{pendentes > 1 ? 's' : ''}</span>}
            </div>
            {convites.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--ink-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <p style={{ fontWeight: 500, marginBottom: 6 }}>Nenhum convite ainda</p>
                <p style={{ fontSize: '0.85rem' }}>Complete seu perfil e marque-o como visível para ser encontrado pelos lares!</p>
                <button onClick={() => setAba('perfil')} style={{ marginTop: '1rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Completar perfil →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {convites.map(c => <ConviteCard key={c.id} convite={c} onResponder={responderConvite} />)}
              </div>
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
