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
const DISPONIBILIDADE_OPCOES = ['Manhã', 'Tarde', 'Noite', 'Fins de semana', 'Qualquer horário']
const CATEGORIAS_OPCOES = [
  'Educação', 'Saúde', 'Assistência Social', 'Idosos', 'Crianças e Adolescentes',
  'Deficiência', 'Meio Ambiente', 'Cultura e Arte', 'Esporte', 'Tecnologia', 'Jurídico', 'Psicologia',
]
const STATUS_OPP = {
  aberta:    { label: 'Aberta',    bg: '#dcfce7', color: '#15803d' },
  encerrada: { label: 'Encerrada', bg: '#f3f4f6', color: '#6b7280' },
  cancelada: { label: 'Cancelada', bg: '#fee2e2', color: '#dc2626' },
  concluida: { label: 'Concluída', bg: 'var(--teal-light)', color: 'var(--teal)' },
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [toast, onClose])
  if (!toast) return null
  return <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>{toast.msg}</div>
}

/* ── Estrelas ── */
function Estrelas({ nota, onChange, readonly = false }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => !readonly && onChange?.(n)} onMouseEnter={() => !readonly && setHover(n)} onMouseLeave={() => !readonly && setHover(0)} style={{ fontSize: '1.2rem', background: 'none', border: 'none', cursor: readonly ? 'default' : 'pointer', padding: 0, lineHeight: 1, color: n <= (hover || nota) ? '#f59e0b' : '#d1d5db', transition: 'color 0.1s' }}>★</button>
      ))}
    </div>
  )
}

/* ── Modal de avaliação do voluntário ── */
function ModalAvaliar({ voluntario, oportunidadeId, onClose, onAvaliar }) {
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const handleEnviar = async () => {
    if (!nota) return
    setEnviando(true)
    try { await onAvaliar({ destinatario_id: voluntario.user_id, oportunidade_id: oportunidadeId, nota, comentario }); onClose() }
    finally { setEnviando(false) }
  }
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>Avaliar voluntário</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', marginBottom: '1.25rem' }}>{voluntario?.nome}</p>
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 8 }}>Nota</p>
          <Estrelas nota={nota} onChange={setNota} />
        </div>
        <textarea rows={3} value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Como foi a participação deste voluntário?" style={{ width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: '0.875rem', border: '1.5px solid var(--border)', background: 'var(--warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none', resize: 'none', lineHeight: 1.6, boxSizing: 'border-box' }} />
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

/* ── Modal de candidatos ── */
function ModalCandidatos({ opp, onClose, onResponder, onAvaliar, showToast }) {
  const [candidatos, setCandidatos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [respondendo, setRespondendo] = useState(null)
  const [modalAval, setModalAval] = useState(null)

  const carregar = useCallback(async () => {
    setCarregando(true)
    try { const res = await api.get(`/oportunidades/${opp.id}/candidatos`); setCandidatos(res.data ?? []) }
    catch { setCandidatos([]) }
    finally { setCarregando(false) }
  }, [opp.id])

  useEffect(() => { carregar() }, [carregar])

  const responder = async (candidatoId, status) => {
    setRespondendo(candidatoId)
    try {
      await onResponder(opp.id, candidatoId, status)
      await carregar()
      showToast(status === 'aprovado' ? 'Candidatura aprovada!' : 'Candidatura rejeitada.')
    } catch (err) { showToast(err.message ?? 'Erro.', 'error') }
    finally { setRespondendo(null) }
  }

  const avaliar = async (data) => {
    try { await onAvaliar(data); await carregar(); showToast('Avaliação enviada!') }
    catch (err) { showToast(err.message ?? 'Erro ao avaliar.', 'error'); throw err }
  }

  const STATUS = {
    pendente:  { label: 'Pendente',    bg: '#fef9c3', color: '#854d0e' },
    aprovado:  { label: 'Aprovado',    bg: 'var(--teal-light)', color: 'var(--teal)' },
    rejeitado: { label: 'Rejeitado',   bg: '#fee2e2', color: '#dc2626' },
    retirado:  { label: 'Retirado',    bg: '#f3f4f6', color: '#6b7280' },
  }

  return (
    <>
      {modalAval && (
        <ModalAvaliar
          voluntario={modalAval.voluntario}
          oportunidadeId={opp.id}
          onClose={() => setModalAval(null)}
          onAvaliar={avaliar}
        />
      )}
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box" style={{ maxWidth: 560, maxHeight: '85vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>Candidatos</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginTop: 2 }}>{opp.titulo}</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--ink-muted)', padding: 4 }}>✕</button>
          </div>

          {carregando ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid var(--coral)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : candidatos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
              <p style={{ fontWeight: 500 }}>Nenhuma candidatura ainda</p>
              <p style={{ fontSize: '0.82rem', marginTop: 4 }}>Quando voluntários se candidatarem, aparecerão aqui.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {candidatos.map(c => {
                const vol = c.volunteer_profiles
                const s = STATUS[c.status] ?? STATUS.pendente
                const podeAvaliar = c.status === 'aprovado' && opp.status === 'concluida'
                return (
                  <div key={c.id} style={{ border: '1px solid var(--border)', borderRadius: 14, padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                          {vol?.nome?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ink)' }}>{vol?.nome ?? 'Voluntário'}</p>
                          <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', marginTop: 1 }}>{vol?.cidade}{vol?.estado ? `, ${vol.estado}` : ''}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>
                    </div>

                    {vol?.habilidades?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {vol.habilidades.slice(0, 4).map(h => (
                          <span key={h} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 100, background: 'var(--coral-light)', color: 'var(--coral-dark)', fontWeight: 500 }}>{h}</span>
                        ))}
                      </div>
                    )}

                    {c.mensagem && <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>"{c.mensagem}"</p>}

                    {c.status === 'pendente' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => responder(c.id, 'rejeitado')} disabled={respondendo === c.id} style={{ flex: 1, padding: '8px', borderRadius: 9, fontSize: '0.8rem', fontWeight: 500, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Rejeitar</button>
                        <button onClick={() => responder(c.id, 'aprovado')} disabled={respondendo === c.id} style={{ flex: 2, padding: '8px', borderRadius: 9, fontSize: '0.8rem', fontWeight: 600, border: 'none', background: 'var(--teal)', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          {respondendo === c.id ? '…' : 'Aprovar candidatura'}
                        </button>
                      </div>
                    )}

                    {podeAvaliar && (
                      <button onClick={() => setModalAval({ voluntario: vol, candidaturaId: c.id })} style={{ padding: '8px', borderRadius: 9, fontSize: '0.8rem', fontWeight: 600, border: '1.5px solid var(--coral)', background: 'transparent', color: 'var(--coral)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        ★ Avaliar voluntário
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/* ── Modal de convite ── */
function ModalConvite({ voluntario, onClose, onEnviar }) {
  const [mensagem, setMensagem] = useState(`Olá, ${voluntario?.nome ?? 'voluntário'}! Ficamos encantados com seu perfil e gostaríamos de convidá-lo(a) para colaborar conosco. Será um prazer contar com seu apoio!`)
  const [enviando, setEnviando] = useState(false)
  const handleEnviar = async () => {
    setEnviando(true)
    try { await onEnviar(voluntario.id, mensagem); onClose() }
    finally { setEnviando(false) }
  }
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', flexShrink: 0 }}>{voluntario?.nome?.[0]?.toUpperCase() ?? '?'}</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)' }}>{voluntario?.nome}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginTop: 2 }}>{voluntario?.cidade}{voluntario?.estado ? `, ${voluntario.estado}` : ''}</p>
          </div>
        </div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 6 }}>Mensagem do convite</label>
        <textarea rows={5} value={mensagem} onChange={e => setMensagem(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: '0.875rem', border: '1.5px solid var(--border)', background: 'var(--warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }} />
        <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', marginTop: 4 }}>O voluntário receberá essa mensagem junto com o convite.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: '1.25rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, fontSize: '0.875rem', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancelar</button>
          <button onClick={handleEnviar} disabled={enviando || !mensagem.trim()} style={{ flex: 2, padding: '11px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, border: 'none', background: 'var(--coral)', color: 'white', cursor: enviando ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', opacity: enviando ? 0.8 : 1 }}>
            {enviando ? 'Enviando…' : 'Enviar convite'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Modal nova/editar oportunidade ── */
function ModalOportunidade({ onClose, onSalvar, inicial }) {
  const vazio = { titulo: '', descricao: '', categorias: [], habilidades_requeridas: [], vagas_totais: 1, carga_horaria: '', data_inicio: '', data_fim: '', presencial: true }
  const [form, setForm] = useState(inicial ?? vazio)
  const [salvando, setSalvando] = useState(false)
  const toggleArr = (campo, val) => setForm(f => ({ ...f, [campo]: f[campo].includes(val) ? f[campo].filter(x => x !== val) : [...f[campo], val] }))
  const handleSalvar = async () => {
    if (!form.titulo.trim() || !form.descricao.trim()) return
    setSalvando(true)
    try { await onSalvar(form); onClose() }
    finally { setSalvando(false) }
  }
  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: '0.875rem', border: '1.5px solid var(--border)', background: 'var(--warm)', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }
  const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 5 }
  const chipStyle = ativo => ({ fontSize: '0.75rem', padding: '5px 12px', borderRadius: 100, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', border: 'none', transition: 'all 0.15s', background: ativo ? 'var(--coral)' : 'var(--warm)', color: ativo ? 'white' : 'var(--ink-muted)' })
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', marginBottom: '1.25rem' }}>{inicial ? 'Editar oportunidade' : 'Nova oportunidade'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label style={labelStyle}>Título *</label><input style={inputStyle} value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ex.: Aulas de reforço escolar" onFocus={e => { e.target.style.borderColor = 'var(--coral)' }} onBlur={e => { e.target.style.borderColor = 'var(--border)' }} /></div>
          <div><label style={labelStyle}>Descrição *</label><textarea rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Descreva o que o voluntário vai fazer, para quem e o impacto esperado." onFocus={e => { e.target.style.borderColor = 'var(--coral)' }} onBlur={e => { e.target.style.borderColor = 'var(--border)' }} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div><label style={labelStyle}>Vagas</label><input type="number" min={1} style={inputStyle} value={form.vagas_totais} onChange={e => setForm({ ...form, vagas_totais: e.target.value })} /></div>
            <div><label style={labelStyle}>Data início</label><input type="date" style={inputStyle} value={form.data_inicio} onChange={e => setForm({ ...form, data_inicio: e.target.value })} /></div>
            <div><label style={labelStyle}>Data fim</label><input type="date" style={inputStyle} value={form.data_fim} onChange={e => setForm({ ...form, data_fim: e.target.value })} /></div>
          </div>
          <div><label style={labelStyle}>Carga horária</label><input style={inputStyle} value={form.carga_horaria} onChange={e => setForm({ ...form, carga_horaria: e.target.value })} placeholder="Ex.: 4h por semana" onFocus={e => { e.target.style.borderColor = 'var(--coral)' }} onBlur={e => { e.target.style.borderColor = 'var(--border)' }} /></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--warm)', borderRadius: 10, border: '1.5px solid var(--border)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)' }}>Presencial</span>
            <button onClick={() => setForm({ ...form, presencial: !form.presencial })} style={{ position: 'relative', width: 44, height: 24, borderRadius: 100, border: 'none', cursor: 'pointer', background: form.presencial ? 'var(--coral)' : '#d1d5db', transition: 'background 0.2s', flexShrink: 0 }}>
              <span style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', left: form.presencial ? 23 : 3 }} />
            </button>
          </div>
          <div>
            <p style={{ ...labelStyle, marginBottom: 8 }}>Categorias</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{CATEGORIAS_OPCOES.map(c => <button key={c} onClick={() => toggleArr('categorias', c)} style={chipStyle(form.categorias.includes(c))}>{c}</button>)}</div>
          </div>
          <div>
            <p style={{ ...labelStyle, marginBottom: 8 }}>Habilidades desejadas</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{HABILIDADES_OPCOES.map(h => <button key={h} onClick={() => toggleArr('habilidades_requeridas', h)} style={chipStyle(form.habilidades_requeridas.includes(h))}>{h}</button>)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: '1.5rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, fontSize: '0.875rem', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando || !form.titulo.trim() || !form.descricao.trim()} style={{ flex: 2, padding: '11px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, border: 'none', background: 'var(--coral)', color: 'white', cursor: salvando ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', opacity: (salvando || !form.titulo.trim() || !form.descricao.trim()) ? 0.6 : 1 }}>
            {salvando ? 'Salvando…' : inicial ? 'Salvar alterações' : 'Criar oportunidade'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Card de voluntário ── */
function VoluntarioCard({ voluntario, jaConvidado, onConvidar }) {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 12, transition: 'transform 0.15s, box-shadow 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', flexShrink: 0, fontSize: '1.1rem' }}>{voluntario.nome?.[0]?.toUpperCase() ?? '?'}</div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{voluntario.nome}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: 1 }}>{voluntario.cidade ?? 'Cidade não informada'}{voluntario.estado ? `, ${voluntario.estado}` : ''}</p>
        </div>
      </div>
      {voluntario.bio && <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{voluntario.bio}</p>}
      {voluntario.habilidades?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {voluntario.habilidades.slice(0, 4).map(h => <span key={h} style={{ fontSize: '0.7rem', fontWeight: 500, padding: '3px 9px', borderRadius: 100, background: 'var(--coral-light)', color: 'var(--coral-dark)' }}>{h}</span>)}
          {voluntario.habilidades.length > 4 && <span style={{ fontSize: '0.7rem', fontWeight: 500, padding: '3px 9px', borderRadius: 100, background: 'var(--warm)', color: 'var(--ink-muted)' }}>+{voluntario.habilidades.length - 4}</span>}
        </div>
      )}
      {voluntario.disponibilidade?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {voluntario.disponibilidade.map(d => <span key={d} style={{ fontSize: '0.7rem', fontWeight: 500, padding: '3px 9px', borderRadius: 100, background: 'var(--teal-light)', color: 'var(--teal)' }}>{d}</span>)}
        </div>
      )}
      <button onClick={() => onConvidar(voluntario)} disabled={jaConvidado} style={{ width: '100%', padding: '9px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: jaConvidado ? 'default' : 'pointer', fontFamily: 'var(--font-body)', background: jaConvidado ? 'var(--teal-light)' : 'var(--coral)', color: jaConvidado ? 'var(--teal)' : 'white', marginTop: 'auto' }}>
        {jaConvidado ? '✓ Convite enviado' : 'Convidar'}
      </button>
    </div>
  )
}

/* ── Card de oportunidade (lar) ── */
function OportunidadeCard({ opp, onMudarStatus, onEditar, onVerCandidatos }) {
  const [mudando, setMudando] = useState(false)
  const s = STATUS_OPP[opp.status] ?? STATUS_OPP.aberta
  const mudar = async (status) => {
    setMudando(true)
    try { await onMudarStatus(opp.id, status) }
    finally { setMudando(false) }
  }
  const vagasDisponiveis = opp.vagas_totais - (opp.vagas_preenchidas ?? 0)
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)', lineHeight: 1.3 }}>{opp.titulo}</p>
          {opp.carga_horaria && <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: 2 }}>{opp.carga_horaria}</p>}
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>
      </div>
      {opp.descricao && <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{opp.descricao}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: opp.presencial ? '#eff6ff' : '#f5f3ff', color: opp.presencial ? '#1d4ed8' : '#6d28d9' }}>{opp.presencial ? 'Presencial' : 'Remoto'}</span>
        <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: vagasDisponiveis > 0 ? '#dcfce7' : '#f3f4f6', color: vagasDisponiveis > 0 ? '#15803d' : '#6b7280' }}>{vagasDisponiveis} vaga{vagasDisponiveis !== 1 ? 's' : ''}</span>
        {opp.data_inicio && <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: 'var(--warm)', color: 'var(--ink-muted)' }}>{new Date(opp.data_inicio).toLocaleDateString('pt-BR')}{opp.data_fim ? ` → ${new Date(opp.data_fim).toLocaleDateString('pt-BR')}` : ''}</span>}
        {opp.categorias?.slice(0, 2).map(c => <span key={c} style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: 'var(--teal-light)', color: 'var(--teal)' }}>{c}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
        <button onClick={() => onVerCandidatos(opp)} style={{ flex: 1, minWidth: 100, padding: '8px', borderRadius: 9, fontSize: '0.8rem', fontWeight: 600, border: 'none', background: 'var(--teal-light)', color: 'var(--teal)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Ver candidatos</button>
        <button onClick={() => onEditar(opp)} style={{ flex: 1, minWidth: 80, padding: '8px', borderRadius: 9, fontSize: '0.8rem', fontWeight: 500, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Editar</button>
        {opp.status === 'aberta' && (
          <>
            <button onClick={() => mudar('concluida')} disabled={mudando} style={{ flex: 1, minWidth: 80, padding: '8px', borderRadius: 9, fontSize: '0.8rem', fontWeight: 500, border: 'none', background: 'var(--teal-light)', color: 'var(--teal)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{mudando ? '…' : 'Concluir'}</button>
            <button onClick={() => mudar('encerrada')} disabled={mudando} style={{ flex: 1, minWidth: 80, padding: '8px', borderRadius: 9, fontSize: '0.8rem', fontWeight: 500, border: 'none', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{mudando ? '…' : 'Encerrar'}</button>
          </>
        )}
        {opp.status === 'encerrada' && <button onClick={() => mudar('aberta')} disabled={mudando} style={{ flex: 1, padding: '8px', borderRadius: 9, fontSize: '0.8rem', fontWeight: 500, border: 'none', background: '#dcfce7', color: '#15803d', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{mudando ? '…' : 'Reabrir'}</button>}
      </div>
    </div>
  )
}

/* ── Item de convite enviado ── */
function ConviteItem({ convite }) {
  const STATUS = {
    pendente: { label: 'Pendente', bg: '#fef9c3', color: '#854d0e' },
    aceito:   { label: 'Aceito',   bg: 'var(--teal-light)', color: 'var(--teal)' },
    recusado: { label: 'Recusado', bg: '#fee2e2', color: '#dc2626' },
    expirado: { label: 'Expirado', bg: '#f3f4f6', color: '#6b7280' },
  }
  const s = STATUS[convite.status] ?? STATUS.pendente
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: 'var(--warm)', border: '1px solid var(--border)' }}>
      <div>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)' }}>{convite.voluntario_nome ?? 'Voluntário'}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: 2 }}>{new Date(convite.criado_em).toLocaleDateString('pt-BR')}</p>
      </div>
      <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '4px 10px', borderRadius: 100, background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>
    </div>
  )
}

/* ── Página principal ── */
export default function DashboardLar() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  const [aba, setAba] = useState('buscar')
  const [voluntarios, setVoluntarios] = useState([])
  const [convites, setConvites] = useState([])
  const [perfil, setPerfil] = useState(null)
  const [oportunidades, setOportunidades] = useState([])
  const [filtros, setFiltros] = useState({ termo: '', cidade: '', habilidades: [], disponibilidade: [] })
  const [buscando, setBuscando] = useState(false)
  const [total, setTotal] = useState(0)
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [perfilForm, setPerfilForm] = useState({})
  const [salvandoPerfil, setSalvandoPerfil] = useState(false)
  const [modalConvite, setModalConvite] = useState(null)
  const [modalOpp, setModalOpp] = useState(null)
  const [modalCandidatos, setModalCandidatos] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => setToast({ msg, type })
  const idsConvidados = new Set(convites.map(c => c.voluntario_id))

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && user.role !== 'lar') router.push('/dashboard/voluntario')
  }, [user, loading, router])

  const buscarVoluntarios = useCallback(async () => {
    setBuscando(true)
    try {
      const params = new URLSearchParams()
      if (filtros.termo) params.set('termo', filtros.termo)
      if (filtros.cidade) params.set('cidade', filtros.cidade)
      if (filtros.habilidades.length) params.set('habilidades', filtros.habilidades.join(','))
      if (filtros.disponibilidade.length) params.set('disponibilidade', filtros.disponibilidade.join(','))
      const res = await api.get(`/voluntarios?${params}`)
      setVoluntarios(res.data?.data ?? [])
      setTotal(res.data?.total ?? 0)
    } catch { setVoluntarios([]) }
    finally { setBuscando(false) }
  }, [filtros])

  const carregarConvites = useCallback(async () => {
    try { const res = await api.get('/convites/enviados'); setConvites(res.data ?? []) } catch {}
  }, [])

  const carregarPerfil = useCallback(async () => {
    try { const res = await api.get('/lares/me/perfil'); setPerfil(res.data); setPerfilForm(res.data ?? {}) } catch {}
  }, [])

  const carregarOportunidades = useCallback(async () => {
    try { const res = await api.get('/oportunidades/me/lista'); setOportunidades(res.data ?? []) } catch {}
  }, [])

  useEffect(() => {
    if (user) { buscarVoluntarios(); carregarConvites(); carregarPerfil(); carregarOportunidades() }
  }, [user, buscarVoluntarios, carregarConvites, carregarPerfil, carregarOportunidades])

  const enviarConvite = async (voluntarioId, mensagem) => {
    await api.post('/convites', { voluntario_id: voluntarioId, mensagem })
    await carregarConvites()
    showToast('Convite enviado com sucesso!')
  }

  const salvarPerfil = async () => {
    setSalvandoPerfil(true)
    try { await api.put('/lares/me/perfil', perfilForm); await carregarPerfil(); setEditandoPerfil(false); showToast('Perfil atualizado!') }
    catch (err) { showToast(err.message ?? 'Erro ao salvar.', 'error') }
    finally { setSalvandoPerfil(false) }
  }

  const criarOportunidade = async (form) => {
    try { await api.post('/oportunidades', form); await carregarOportunidades(); showToast('Oportunidade criada!') }
    catch (err) { showToast(err.message ?? 'Erro.', 'error'); throw err }
  }

  const editarOportunidade = async (form) => {
    try { await api.put(`/oportunidades/${form.id}`, form); await carregarOportunidades(); showToast('Oportunidade atualizada!') }
    catch (err) { showToast(err.message ?? 'Erro.', 'error'); throw err }
  }

  const mudarStatusOpp = async (id, status) => {
    try {
      await api.patch(`/oportunidades/${id}/status`, { status })
      await carregarOportunidades()
      const msgs = { concluida: 'Oportunidade concluída! Agora você pode avaliar os participantes.', encerrada: 'Oportunidade encerrada.', aberta: 'Oportunidade reaberta!' }
      showToast(msgs[status] ?? 'Status atualizado.')
    } catch (err) { showToast(err.message ?? 'Erro.', 'error') }
  }

  const responderCandidatura = async (oppId, appId, status) => {
    await api.patch(`/oportunidades/${oppId}/candidatos/${appId}`, { status })
  }

  const avaliar = async ({ destinatario_id, oportunidade_id, nota, comentario }) => {
    await api.post('/avaliacoes', { destinatario_id, oportunidade_id, nota, comentario })
  }

  const toggleFiltroMulti = (campo, valor) =>
    setFiltros(prev => ({ ...prev, [campo]: prev[campo].includes(valor) ? prev[campo].filter(x => x !== valor) : [...prev[campo], valor] }))

  const abertas = oportunidades.filter(o => o.status === 'aberta').length

  if (loading || !user) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--warm)' }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {modalConvite && <ModalConvite voluntario={modalConvite} onClose={() => setModalConvite(null)} onEnviar={enviarConvite} />}
      {modalOpp && <ModalOportunidade inicial={modalOpp === 'nova' ? null : modalOpp} onClose={() => setModalOpp(null)} onSalvar={modalOpp === 'nova' ? criarOportunidade : editarOportunidade} />}
      {modalCandidatos && <ModalCandidatos opp={modalCandidatos} onClose={() => setModalCandidatos(null)} onResponder={responderCandidatura} onAvaliar={avaliar} showToast={showToast} />}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: 'var(--coral)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'white' }}><path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" /></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>Laço</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>{user.nome?.[0]?.toUpperCase() ?? '?'}</div>
            <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>{user.nome}</span>
            <button onClick={async () => { await logout(); router.push('/') }} style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: 100, background: 'var(--warm)', color: 'var(--ink-muted)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Sair</button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>

        {/* Abas */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
          {[
            { id: 'buscar', label: 'Buscar Voluntários' },
            { id: 'oportunidades', label: `Oportunidades${abertas > 0 ? ` (${abertas})` : ''}` },
            { id: 'convites', label: `Convites (${convites.length})` },
            { id: 'perfil', label: 'Perfil do Lar' },
          ].map(a => (
            <button key={a.id} onClick={() => setAba(a.id)} style={{ padding: '10px 18px', fontSize: '0.875rem', fontWeight: 500, color: aba === a.id ? 'var(--coral)' : 'var(--ink-muted)', background: 'none', border: 'none', borderBottom: `2px solid ${aba === a.id ? 'var(--coral)' : 'transparent'}`, cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: -1, whiteSpace: 'nowrap' }}>
              {a.label}
            </button>
          ))}
        </div>

        {/* ── ABA: BUSCAR ── */}
        {aba === 'buscar' && (
          <div>
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '1rem' }}>Filtros de busca</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                {[{ key: 'termo', placeholder: 'Buscar por nome ou bio…' }, { key: 'cidade', placeholder: 'Cidade…' }].map(({ key, placeholder }) => (
                  <input key={key} type="text" placeholder={placeholder} value={filtros[key]} onChange={e => setFiltros({ ...filtros, [key]: e.target.value })} onKeyDown={e => e.key === 'Enter' && buscarVoluntarios()} className="auth-input" style={{ fontSize: '0.875rem' }} />
                ))}
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 8 }}>Habilidades</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {HABILIDADES_OPCOES.map(h => { const ativo = filtros.habilidades.includes(h); return <button key={h} onClick={() => toggleFiltroMulti('habilidades', h)} style={{ fontSize: '0.78rem', padding: '5px 12px', borderRadius: 100, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', border: 'none', transition: 'all 0.15s', background: ativo ? 'var(--coral)' : 'var(--warm)', color: ativo ? 'white' : 'var(--ink-muted)' }}>{h}</button> })}
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 8 }}>Disponibilidade</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {DISPONIBILIDADE_OPCOES.map(d => { const ativo = filtros.disponibilidade.includes(d); return <button key={d} onClick={() => toggleFiltroMulti('disponibilidade', d)} style={{ fontSize: '0.78rem', padding: '5px 12px', borderRadius: 100, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', border: 'none', transition: 'all 0.15s', background: ativo ? 'var(--teal)' : 'var(--warm)', color: ativo ? 'white' : 'var(--ink-muted)' }}>{d}</button> })}
                </div>
              </div>
              <button onClick={buscarVoluntarios} style={{ padding: '10px 24px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, background: 'var(--coral)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Buscar</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)' }}>{buscando ? 'Buscando…' : `${total} voluntário${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}</h2>
            </div>
            {buscando ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--coral)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : voluntarios.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--ink-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p style={{ fontWeight: 500 }}>Nenhum voluntário encontrado</p>
                <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Tente outros filtros ou limpe a busca.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {voluntarios.map(v => <VoluntarioCard key={v.id} voluntario={v} jaConvidado={idsConvidados.has(v.id)} onConvidar={vol => setModalConvite(vol)} />)}
              </div>
            )}
          </div>
        )}

        {/* ── ABA: OPORTUNIDADES ── */}
        {aba === 'oportunidades' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>Minhas oportunidades</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: 2 }}>{oportunidades.length === 0 ? 'Nenhuma oportunidade criada ainda.' : `${oportunidades.length} oportunidade${oportunidades.length !== 1 ? 's' : ''} · ${abertas} aberta${abertas !== 1 ? 's' : ''}`}</p>
              </div>
              <button onClick={() => setModalOpp('nova')} style={{ padding: '10px 20px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, background: 'var(--coral)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', flexShrink: 0 }}>+ Nova oportunidade</button>
            </div>
            {oportunidades.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--ink-muted)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📋</div>
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)', marginBottom: 6 }}>Nenhuma oportunidade ainda</p>
                <p style={{ fontSize: '0.875rem', maxWidth: 340, margin: '0 auto 1.25rem' }}>Crie oportunidades para atrair voluntários com o perfil certo para o seu lar.</p>
                <button onClick={() => setModalOpp('nova')} style={{ padding: '12px 28px', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600, background: 'var(--coral)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Criar primeira oportunidade</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {oportunidades.map(opp => <OportunidadeCard key={opp.id} opp={opp} onMudarStatus={mudarStatusOpp} onEditar={o => setModalOpp(o)} onVerCandidatos={o => setModalCandidatos(o)} />)}
              </div>
            )}
          </div>
        )}

        {/* ── ABA: CONVITES ── */}
        {aba === 'convites' && (
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)', marginBottom: '1rem' }}>Convites enviados</h2>
            {convites.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--ink-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📨</div>
                <p style={{ fontWeight: 500 }}>Nenhum convite enviado ainda</p>
                <button onClick={() => setAba('buscar')} style={{ marginTop: '1rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Buscar voluntários →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {convites.map(c => <ConviteItem key={c.id} convite={c} />)}
              </div>
            )}
          </div>
        )}

        {/* ── ABA: PERFIL ── */}
        {aba === 'perfil' && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>Perfil do Lar</h2>
              {!editandoPerfil && <button onClick={() => setEditandoPerfil(true)} style={{ fontSize: '0.85rem', fontWeight: 500, padding: '8px 20px', borderRadius: 10, background: 'var(--coral)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Editar perfil</button>}
            </div>
            {!editandoPerfil ? (
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {perfil ? [
                  { label: 'Nome do Lar', value: perfil.nome_lar },
                  { label: 'CNPJ', value: perfil.cnpj },
                  { label: 'Cidade / Estado', value: perfil.cidade && `${perfil.cidade}${perfil.estado ? `, ${perfil.estado}` : ''}` },
                  { label: 'Endereço', value: perfil.endereco },
                  { label: 'Telefone', value: perfil.telefone },
                  { label: 'E-mail de contato', value: perfil.email_contato },
                  { label: 'Responsável', value: perfil.responsavel },
                  { label: 'Área de atuação', value: perfil.area_atuacao },
                  { label: 'Chave PIX', value: perfil.chave_pix },
                  { label: 'Descrição', value: perfil.descricao },
                ].filter(f => f.value).map(({ label, value }) => (
                  <div key={label} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 3 }}>{label}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.5 }}>{value}</p>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-muted)' }}>
                    <p style={{ fontSize: '0.875rem' }}>Perfil ainda não preenchido.</p>
                    <button onClick={() => setEditandoPerfil(true)} style={{ marginTop: '0.75rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Preencher agora →</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Nome do Lar', field: 'nome_lar' }, { label: 'CNPJ', field: 'cnpj' },
                  { label: 'Cidade', field: 'cidade' }, { label: 'Estado (UF)', field: 'estado' },
                  { label: 'Endereço', field: 'endereco' }, { label: 'Telefone', field: 'telefone' },
                  { label: 'E-mail de contato', field: 'email_contato' }, { label: 'Responsável', field: 'responsavel' },
                  { label: 'Área de atuação', field: 'area_atuacao' }, { label: 'Chave PIX', field: 'chave_pix' },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 5 }}>{label}</label>
                    <input type="text" value={perfilForm[field] ?? ''} onChange={e => setPerfilForm({ ...perfilForm, [field]: e.target.value })} className="auth-input" style={{ fontSize: '0.875rem' }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 5 }}>Descrição</label>
                  <textarea rows={4} value={perfilForm.descricao ?? ''} onChange={e => setPerfilForm({ ...perfilForm, descricao: e.target.value })} className="auth-input" style={{ fontSize: '0.875rem', resize: 'vertical', lineHeight: 1.6 }} />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button onClick={() => { setEditandoPerfil(false); setPerfilForm(perfil ?? {}) }} style={{ flex: 1, padding: '11px', borderRadius: 10, fontSize: '0.875rem', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancelar</button>
                  <button onClick={salvarPerfil} disabled={salvandoPerfil} style={{ flex: 2, padding: '11px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, border: 'none', background: 'var(--coral)', color: 'white', cursor: salvandoPerfil ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', opacity: salvandoPerfil ? 0.8 : 1 }}>
                    {salvandoPerfil ? 'Salvando…' : 'Salvar alterações'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
