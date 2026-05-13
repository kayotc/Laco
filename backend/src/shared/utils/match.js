export function calcularScore(voluntario, oportunidade) {
  let score = 0

  const interesses = voluntario.interesses ?? []
  const habilidades = voluntario.habilidades ?? []
  const dispCidades = (voluntario.disponibilidade_locais ?? []).map((c) => c.toLowerCase())

  const categoriasOp = oportunidade.categorias ?? []
  const habilidadesOp = oportunidade.habilidades_requeridas ?? []
  const cidadeOp = (oportunidade.cidade ?? '').toLowerCase()

  // Match por categorias/interesses (até 40 pts)
  const matchCategorias = interesses.filter((i) => categoriasOp.includes(i)).length
  score += Math.min(matchCategorias * 10, 40)

  // Match por habilidades (até 40 pts)
  const matchHabilidades = habilidades.filter((h) => habilidadesOp.includes(h)).length
  score += Math.min(matchHabilidades * 10, 40)

  // Match por cidade (20 pts)
  if (dispCidades.some((c) => c.includes(cidadeOp) || cidadeOp.includes(c))) {
    score += 20
  }

  return Math.min(score, 100)
}

export function rankVoluntarios(voluntarios, oportunidade) {
  return voluntarios
    .map((v) => ({ ...v, score: calcularScore(v, oportunidade) }))
    .filter((v) => v.score > 0)
    .sort((a, b) => b.score - a.score)
}
