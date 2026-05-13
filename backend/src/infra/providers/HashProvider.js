import bcrypt from 'bcryptjs'
import { env } from '../../shared/config/env.js'

export class HashProvider {
  async hash(plain) {
    return bcrypt.hash(plain, env.bcryptRounds)
  }

  async compare(plain, hashed) {
    return bcrypt.compare(plain, hashed)
  }
}
