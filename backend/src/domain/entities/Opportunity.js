export const OpportunityStatus = {
  ABERTA: 'aberta',
  ENCERRADA: 'encerrada',
  CANCELADA: 'cancelada',
  CONCLUIDA: 'concluida',
}

export class Opportunity {
  constructor({
    id, lar_id, titulo, descricao, categorias, habilidades_requeridas,
    cidade, estado, data_inicio, data_fim, vagas_totais, vagas_preenchidas,
    carga_horaria, presencial, status, criado_em, atualizado_em,
    lar_nome, lar_logo,
  }) {
    this.id = id
    this.lar_id = lar_id
    this.titulo = titulo
    this.descricao = descricao
    this.categorias = categorias ?? []
    this.habilidades_requeridas = habilidades_requeridas ?? []
    this.cidade = cidade
    this.estado = estado
    this.data_inicio = data_inicio
    this.data_fim = data_fim
    this.vagas_totais = vagas_totais ?? 1
    this.vagas_preenchidas = vagas_preenchidas ?? 0
    this.carga_horaria = carga_horaria
    this.presencial = presencial ?? true
    this.status = status ?? OpportunityStatus.ABERTA
    this.criado_em = criado_em
    this.atualizado_em = atualizado_em
    this.lar_nome = lar_nome
    this.lar_logo = lar_logo
  }

  vagasDisponiveis() {
    return this.vagas_totais - this.vagas_preenchidas
  }

  estaAberta() {
    return this.status === OpportunityStatus.ABERTA && this.vagasDisponiveis() > 0
  }
}
