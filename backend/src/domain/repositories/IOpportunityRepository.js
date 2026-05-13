export class IOpportunityRepository {
  async findById(id) { throw new Error('Not implemented') }
  async findByLar(larId, filters) { throw new Error('Not implemented') }
  async findAll(filters, page, limit) { throw new Error('Not implemented') }
  async create(data) { throw new Error('Not implemented') }
  async update(id, data) { throw new Error('Not implemented') }
  async delete(id) { throw new Error('Not implemented') }
  async incrementVagas(id) { throw new Error('Not implemented') }
  async findApplications(oportunidadeId) { throw new Error('Not implemented') }
  async apply(oportunidadeId, voluntarioId) { throw new Error('Not implemented') }
  async updateApplicationStatus(id, status) { throw new Error('Not implemented') }
}
