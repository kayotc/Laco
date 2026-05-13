export class User {
  constructor({ id, email, role, nome, ativo, criado_em, atualizado_em }) {
    this.id = id
    this.email = email
    this.role = role // 'admin' | 'lar' | 'voluntario'
    this.nome = nome
    this.ativo = ativo ?? true
    this.criado_em = criado_em
    this.atualizado_em = atualizado_em
  }

  isAdmin() { return this.role === 'admin' }
  isLar() { return this.role === 'lar' }
  isVoluntario() { return this.role === 'voluntario' }
  isAtivo() { return this.ativo === true }
}
