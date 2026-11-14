export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/

export function validateEmail(email: string): { isValid: boolean; message?: string } {
  const trimmed = email.trim()
  if (!trimmed) {
    return {
      isValid: false,
      message: 'Please provide a valid email.',
    }
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address.',
    }
  }

  return { isValid: true }
}
