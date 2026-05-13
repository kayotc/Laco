export class VolunteerProfile {
  constructor({
    id, user_id, nome, bio, foto_url, cidade, estado, habilidades,
    interesses, disponibilidade, disponibilidade_locais, experiencias,
    certificados, redes_sociais, reputacao_score, total_horas,
    total_acoes, visivel, criado_em, atualizado_em,
  }) {
    this.id = id
    this.user_id = user_id
    this.nome = nome
    this.bio = bio
    this.foto_url = foto_url
    this.cidade = cidade
    this.estado = estado
    this.habilidades = habilidades ?? []
    this.interesses = interesses ?? []
    this.disponibilidade = disponibilidade ?? []
    this.disponibilidade_locais = disponibilidade_locais ?? []
    this.experiencias = experiencias ?? []
    this.certificados = certificados ?? []
    this.redes_sociais = redes_sociais ?? {}
    this.reputacao_score = reputacao_score ?? 0
    this.total_horas = total_horas ?? 0
    this.total_acoes = total_acoes ?? 0
    this.visivel = visivel ?? true
    this.criado_em = criado_em
    this.atualizado_em = atualizado_em
  }

  getNivel() {
    if (this.reputacao_score >= 500) return 'Especialista'
    if (this.reputacao_score >= 200) return 'Experiente'
    if (this.reputacao_score >= 50) return 'Ativo'
    return 'Iniciante'
  }
}
