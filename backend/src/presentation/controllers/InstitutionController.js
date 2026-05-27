import { ok } from '../../shared/utils/response.js'
import { NotFoundError, ValidationError, AppError } from '../../shared/errors/AppError.js'
import { supabase } from '../../infra/database/supabase.js'

export class InstitutionController {
  constructor(institutionRepo, updateUseCase) {
    this.list = this.list.bind(this)
    this.getById = this.getById.bind(this)
    this.getMyProfile = this.getMyProfile.bind(this)
    this.updateMyProfile = this.updateMyProfile.bind(this)
    this.uploadLogo = this.uploadLogo.bind(this)

    this._repo = institutionRepo
    this._update = updateUseCase
  }

  async list(req, res) {
    const { cidade, estado, categorias, termo, page = 1, limit = 20 } = req.query
    const filters = {
      cidade,
      estado,
      categorias: categorias ? categorias.split(',') : undefined,
      termo,
    }
    const result = await this._repo.findAll(filters, Number(page), Number(limit))
    ok(res, result)
  }

  async getById(req, res) {
    const perfil = await this._repo.findById(req.params.id)
    if (!perfil) throw new NotFoundError('Lar')
    ok(res, perfil)
  }

  async getMyProfile(req, res) {
    const perfil = await this._repo.findByUserId(req.user.id)
    if (!perfil) throw new NotFoundError('Perfil do lar')
    ok(res, perfil)
  }

  async updateMyProfile(req, res) {
    const perfil = await this._update.execute(req.user.id, req.body)
    ok(res, perfil, 'Perfil atualizado')
  }

  async uploadLogo(req, res) {
    if (!req.file) throw new ValidationError('Nenhum arquivo enviado')

    const inst = await this._repo.findByUserId(req.user.id)
    if (!inst) throw new NotFoundError('Perfil do lar')

    const mime = req.file.mimetype
    if (!mime.startsWith('image/')) throw new ValidationError('Apenas imagens são permitidas')

    const ext = mime.split('/')[1].replace('jpeg', 'jpg')
    const filePath = `lares/${inst.id}.${ext}`

    await supabase.storage.createBucket('logos', { public: true }).catch(() => {})

    const { error: uploadErr } = await supabase.storage
      .from('logos')
      .upload(filePath, req.file.buffer, { contentType: mime, upsert: true })

    if (uploadErr) throw new AppError(uploadErr.message, 500)

    const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(filePath)

    await this._repo.update(req.user.id, { logo_url: publicUrl })
    ok(res, { logo_url: publicUrl })
  }
}
