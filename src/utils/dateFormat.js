export function formatSessionDate(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
