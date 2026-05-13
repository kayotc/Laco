export class IInvitationRepository {
  async create(data) { throw new Error('Not implemented') }
  async findById(id) { throw new Error('Not implemented') }
  async findByLar(larId, status) { throw new Error('Not implemented') }
  async findByVoluntario(voluntarioId, status) { throw new Error('Not implemented') }
  async updateStatus(id, status) { throw new Error('Not implemented') }
  async countPendentesHoje(larId, voluntarioId) { throw new Error('Not implemented') }
  async expireOld() { throw new Error('Not implemented') }
}
