function getCleanText(string) {
  return string.trim().replace(/\n/g, '').replace(/ {2,}/g, ' ')
}

const SPANISH_MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

module.exports = { getCleanText, SPANISH_MONTHS }
