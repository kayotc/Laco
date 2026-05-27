import { ForbiddenError, AppError } from '../../../shared/errors/AppError.js'

export class JoinGroupUseCase {
  constructor(groupRepo, volunteerRepo) {
    this.groupRepo = groupRepo
    this.volunteerRepo = volunteerRepo
  }

  async execute(userId, groupId) {
    const voluntario = await this.volunteerRepo.findByUserId(userId)
    if (!voluntario) throw new ForbiddenError('Perfil de voluntário não encontrado')

    const grupo = await this.groupRepo.findById(groupId)
    if (!grupo) throw new AppError('Grupo não encontrado', 404)

    await this.groupRepo.addMember(groupId, voluntario.id)
    return grupo
  }
}

export class LeaveGroupUseCase {
  constructor(groupRepo, volunteerRepo) {
    this.groupRepo = groupRepo
    this.volunteerRepo = volunteerRepo
  }

  async execute(userId, groupId) {
    const voluntario = await this.volunteerRepo.findByUserId(userId)
    if (!voluntario) throw new ForbiddenError('Perfil de voluntário não encontrado')

    const grupo = await this.groupRepo.findById(groupId)
    if (!grupo) throw new AppError('Grupo não encontrado', 404)

    await this.groupRepo.removeMember(groupId, voluntario.id)
  }
}
