// Repositories
import { UserRepository } from './repositories/UserRepository.js'
import { VolunteerRepository } from './repositories/VolunteerRepository.js'
import { InstitutionRepository } from './repositories/InstitutionRepository.js'
import { InvitationRepository } from './repositories/InvitationRepository.js'
import { OpportunityRepository } from './repositories/OpportunityRepository.js'
import { GroupRepository } from './repositories/GroupRepository.js'
import { GroupInvitationRepository } from './repositories/GroupInvitationRepository.js'

// Providers
import { TokenProvider } from './providers/TokenProvider.js'
import { HashProvider } from './providers/HashProvider.js'

// Use Cases
import { RegisterUseCase } from '../application/useCases/auth/RegisterUseCase.js'
import { LoginUseCase } from '../application/useCases/auth/LoginUseCase.js'
import { RefreshTokenUseCase } from '../application/useCases/auth/RefreshTokenUseCase.js'
import { SearchVolunteersUseCase } from '../application/useCases/volunteers/SearchVolunteersUseCase.js'
import { UpdateVolunteerProfileUseCase } from '../application/useCases/volunteers/UpdateVolunteerProfileUseCase.js'
import { UpdateInstitutionProfileUseCase } from '../application/useCases/institutions/UpdateInstitutionProfileUseCase.js'
import { SendInvitationUseCase } from '../application/useCases/invitations/SendInvitationUseCase.js'
import { RespondInvitationUseCase } from '../application/useCases/invitations/RespondInvitationUseCase.js'
import { CreateGroupUseCase } from '../application/useCases/groups/CreateGroupUseCase.js'
import { JoinGroupUseCase, LeaveGroupUseCase } from '../application/useCases/groups/JoinLeaveGroupUseCase.js'

// Controllers
import { AuthController } from '../presentation/controllers/AuthController.js'
import { VolunteerController } from '../presentation/controllers/VolunteerController.js'
import { InstitutionController } from '../presentation/controllers/InstitutionController.js'
import { InvitationController } from '../presentation/controllers/InvitationController.js'
import { OpportunityController } from '../presentation/controllers/OpportunityController.js'
import { EvaluationController } from '../presentation/controllers/EvaluationController.js'
import { GroupController } from '../presentation/controllers/GroupController.js'
import { EvaluationRepository } from './repositories/EvaluationRepository.js'

// Instâncias únicas (singleton simples)
const userRepo = new UserRepository()
const volunteerRepo = new VolunteerRepository()
const institutionRepo = new InstitutionRepository()
const invitationRepo = new InvitationRepository()
const opportunityRepo = new OpportunityRepository()
const evaluationRepo = new EvaluationRepository()
const groupRepo = new GroupRepository()
const groupInvitationRepo = new GroupInvitationRepository()
const tokenProvider = new TokenProvider()
const hashProvider = new HashProvider()

// Use Cases
const registerUC = new RegisterUseCase(userRepo, volunteerRepo, institutionRepo, hashProvider, tokenProvider)
const loginUC = new LoginUseCase(userRepo, hashProvider, tokenProvider)
const refreshUC = new RefreshTokenUseCase(userRepo, tokenProvider)
const searchVolunteersUC = new SearchVolunteersUseCase(volunteerRepo)
const updateVolunteerUC = new UpdateVolunteerProfileUseCase(volunteerRepo)

const updateInstitutionUC = new UpdateInstitutionProfileUseCase(institutionRepo)
const sendInvitationUC = new SendInvitationUseCase(invitationRepo, volunteerRepo, institutionRepo, opportunityRepo)
const respondInvitationUC = new RespondInvitationUseCase(invitationRepo, volunteerRepo)

// Controllers
export const authController = new AuthController(registerUC, loginUC, refreshUC, userRepo)
export const volunteerController = new VolunteerController(volunteerRepo, searchVolunteersUC, updateVolunteerUC, opportunityRepo)
export const institutionController = new InstitutionController(institutionRepo, updateInstitutionUC)
export const invitationController = new InvitationController(
  invitationRepo, sendInvitationUC, respondInvitationUC, institutionRepo, volunteerRepo
)
export const opportunityController = new OpportunityController(opportunityRepo, institutionRepo, volunteerRepo)
export const evaluationController = new EvaluationController(evaluationRepo)

const createGroupUC = new CreateGroupUseCase(groupRepo, volunteerRepo)
const joinGroupUC = new JoinGroupUseCase(groupRepo, volunteerRepo)
const leaveGroupUC = new LeaveGroupUseCase(groupRepo, volunteerRepo)
export const groupController = new GroupController(groupRepo, volunteerRepo, createGroupUC, joinGroupUC, leaveGroupUC, groupInvitationRepo)
