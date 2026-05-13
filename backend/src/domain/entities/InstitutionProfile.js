export class InstitutionProfile {
  constructor({
    id, user_id, nome_lar, cnpj, descricao, logo_url, fotos,
    endereco, cidade, estado, cep, telefone, email_contato,
    responsavel, site, redes_sociais, area_atuacao, categorias,
    chave_pix, latitude, longitude, total_voluntarios, verificado,
    criado_em, atualizado_em,
  }) {
    this.id = id
    this.user_id = user_id
    this.nome_lar = nome_lar
    this.cnpj = cnpj
    this.descricao = descricao
    this.logo_url = logo_url
    this.fotos = fotos ?? []
    this.endereco = endereco
    this.cidade = cidade
    this.estado = estado
    this.cep = cep
    this.telefone = telefone
    this.email_contato = email_contato
    this.responsavel = responsavel
    this.site = site
    this.redes_sociais = redes_sociais ?? {}
    this.area_atuacao = area_atuacao
    this.categorias = categorias ?? []
    this.chave_pix = chave_pix
    this.latitude = latitude
    this.longitude = longitude
    this.total_voluntarios = total_voluntarios ?? 0
    this.verificado = verificado ?? false
    this.criado_em = criado_em
    this.atualizado_em = atualizado_em
  }
}
