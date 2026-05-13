export class IVolunteerRepository {
  async findByUserId(userId) { throw new Error('Not implemented') }
  async findById(id) { throw new Error('Not implemented') }
  async create(data) { throw new Error('Not implemented') }
  async update(userId, data) { throw new Error('Not implemented') }
  async search(filters, page, limit) { throw new Error('Not implemented') }
  async addHabilidades(voluntarioId, habilidades) { throw new Error('Not implemented') }
  async updateReputacao(voluntarioId, delta) { throw new Error('Not implemented') }
  async findFavoritosByLar(larId) { throw new Error('Not implemented') }
  async toggleFavorito(larId, voluntarioId) { throw new Error('Not implemented') }
}
