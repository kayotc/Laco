import { rankVoluntarios } from '../../../shared/utils/match.js'

export class SearchVolunteersUseCase {
  constructor(volunteerRepo) {
    this.volunteerRepo = volunteerRepo
  }

  async execute(filters, page = 1, limit = 20) {
    const result = await this.volunteerRepo.search(filters, page, limit)

    // Se há filtros de compatibilidade, rankear pelo score
    if (filters.habilidades?.length || filters.interesses?.length) {
      const ranked = rankVoluntarios(result.data, {
        categorias: filters.interesses ?? [],
        habilidades_requeridas: filters.habilidades ?? [],
        cidade: filters.cidade ?? '',
      })
      return { ...result, data: ranked }
    }

    return result
  }
}
