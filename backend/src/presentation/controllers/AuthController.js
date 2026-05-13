import { ok, created } from '../../shared/utils/response.js'

export class AuthController {
  constructor(registerUseCase, loginUseCase, refreshTokenUseCase, userRepo) {
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.refresh = this.refresh.bind(this)
    this.logout = this.logout.bind(this)
    this.me = this.me.bind(this)

    this._register = registerUseCase
    this._login = loginUseCase
    this._refresh = refreshTokenUseCase
    this._userRepo = userRepo
  }

  async register(req, res) {
    const data = await this._register.execute(req.body)
    created(res, data, 'Conta criada com sucesso')
  }

  async login(req, res) {
    const data = await this._login.execute(req.body)
    ok(res, data, 'Login realizado com sucesso')
  }

  async refresh(req, res) {
    const { refreshToken } = req.body
    const data = await this._refresh.execute(refreshToken)
    ok(res, data)
  }

  async logout(req, res) {
    const { refreshToken } = req.body
    if (refreshToken) await this._userRepo.deleteRefreshToken(refreshToken)
    ok(res, null, 'Logout realizado')
  }

  async me(req, res) {
    const user = await this._userRepo.findById(req.user.id)
    ok(res, { id: user.id, email: user.email, nome: user.nome, role: user.role })
  }
}
