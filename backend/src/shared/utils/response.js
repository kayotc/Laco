export const ok = (res, data, message = 'Sucesso') =>
  res.status(200).json({ success: true, message, data })

export const created = (res, data, message = 'Criado com sucesso') =>
  res.status(201).json({ success: true, message, data })

export const noContent = (res) => res.status(204).send()

export const paginated = (res, data, meta) =>
  res.status(200).json({ success: true, data, meta })

export const error = (res, message, statusCode = 400, code = 'ERROR', errors = []) =>
  res.status(statusCode).json({ success: false, message, code, errors })
