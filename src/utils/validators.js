export function required(value, fieldLabel = 'Este campo') {
  if (value === null || value === undefined || String(value).trim() === '') {
    return `${fieldLabel} es requerido.`
  }
  return null
}

export function isPositiveNumber(value, fieldLabel = 'Este campo') {
  const number = Number(value)
  if (value === null || value === undefined || value === '' || Number.isNaN(number)) {
    return `${fieldLabel} debe ser numérico.`
  }
  if (number <= 0) {
    return `${fieldLabel} debe ser mayor que 0.`
  }
  return null
}

export function isNonNegativeInteger(value, fieldLabel = 'Este campo') {
  const number = Number(value)
  if (value === null || value === undefined || value === '' || Number.isNaN(number)) {
    return `${fieldLabel} debe ser numérico.`
  }
  if (!Number.isInteger(number) || number < 0) {
    return `${fieldLabel} debe ser un número entero mayor o igual a 0.`
  }
  return null
}

export function validateProductForm(form) {
  const errors = {}

  const nameError = required(form.name, 'El nombre')
  if (nameError) errors.name = nameError

  const priceError = isPositiveNumber(form.price, 'El precio')
  if (priceError) errors.price = priceError

  const stockError = isNonNegativeInteger(form.stock, 'El stock')
  if (stockError) errors.stock = stockError

  const categoryError = required(form.category_id, 'La categoría')
  if (categoryError) errors.category_id = categoryError

  return errors
}

export function validateCategoryForm(form) {
  const errors = {}

  const nameError = required(form.name, 'El nombre')
  if (nameError) errors.name = nameError

  return errors
}

export function validateLoginForm(form) {
  const errors = {}

  const usernameError = required(form.username, 'El usuario')
  if (usernameError) errors.username = usernameError

  const passwordError = required(form.password, 'La contraseña')
  if (passwordError) errors.password = passwordError

  return errors
}

export function validateUserForm(form, { isEdit = false } = {}) {
  const errors = {}

  const nameError = required(form.name, 'El nombre')
  if (nameError) errors.name = nameError

  const usernameError = required(form.username, 'El usuario')
  if (usernameError) errors.username = usernameError

  if (!isEdit || form.password) {
    const passwordError = required(form.password, 'La contraseña')
    if (passwordError) {
      errors.password = passwordError
    } else if (form.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres.'
    }
  }

  return errors
}
