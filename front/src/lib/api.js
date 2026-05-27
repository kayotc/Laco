'use client'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('laco_access_token')
}

// singleton para evitar múltiplas chamadas de refresh simultâneas
let refreshingPromise = null

async function doRefresh() {
  if (refreshingPromise) return refreshingPromise
  refreshingPromise = (async () => {
    const refreshToken = localStorage.getItem('laco_refresh_token')
    if (!refreshToken) throw new Error('sem refresh token')
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const json = await res.json().catch(() => null)
    if (!res.ok) throw new Error('refresh falhou')
    const { accessToken, refreshToken: newRT } = json.data
    localStorage.setItem('laco_access_token', accessToken)
    localStorage.setItem('laco_refresh_token', newRT)
    return accessToken
  })()
  try {
    return await refreshingPromise
  } finally {
    refreshingPromise = null
  }
}

async function request(path, options = {}, canRetry = true) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...(options.headers ?? {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const json = await res.json().catch(() => null)

  if (!res.ok) {
    if (res.status === 401 && canRetry) {
      try {
        await doRefresh()
        return request(path, options, false)
      } catch {
        localStorage.removeItem('laco_access_token')
        localStorage.removeItem('laco_refresh_token')
        window.location.href = '/login'
        throw new Error('Sessão expirada. Faça login novamente.')
      }
    }
    const msg = json?.message ?? 'Erro na requisição'
    const err = new Error(msg)
    err.status = res.status
    err.data = json
    throw err
  }

  return json
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
  postForm: (path, formData) => request(path, { method: 'POST', body: formData, headers: {} }),
}
