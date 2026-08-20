export async function submitContactForm(formData) {
  if (formData._gotcha) return { success: false, error: 'Invalid submission' };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_RE.test(String(formData.email || ''))) {
    return { success: false, error: 'Invalid email address' };
  }

  return { success: true };
}
