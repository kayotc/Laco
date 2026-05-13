export const InvitationStatus = {
  PENDENTE: 'pendente',
  ACEITO: 'aceito',
  RECUSADO: 'recusado',
  EXPIRADO: 'expirado',
  CANCELADO: 'cancelado',
}

export class Invitation {
  constructor({
    id, lar_id, voluntario_id, oportunidade_id, mensagem,
    status, expira_em, respondido_em, criado_em,
    lar_nome, voluntario_nome,
  }) {
    this.id = id
    this.lar_id = lar_id
    this.voluntario_id = voluntario_id
    this.oportunidade_id = oportunidade_id
    this.mensagem = mensagem
    this.status = status ?? InvitationStatus.PENDENTE
    this.expira_em = expira_em
    this.respondido_em = respondido_em
    this.criado_em = criado_em
    this.lar_nome = lar_nome
    this.voluntario_nome = voluntario_nome
  }

  estaExpirado() {
    if (!this.expira_em) return false
    return new Date() > new Date(this.expira_em)
  }

  estaPendente() {
    return this.status === InvitationStatus.PENDENTE && !this.estaExpirado()
  }
}
