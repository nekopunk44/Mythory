const UNITS = [
  { value: 1_000_000_000, suffix: 'B' },
  { value: 1_000_000, suffix: 'M' },
  { value: 1_000, suffix: 'K' },
]

const formatCount = (value) => {
  const count = Number(value)

  if (!Number.isFinite(count)) {
    return '0'
  }

  const unitIndex = UNITS.findIndex(({ value: unitValue }) => {
    return Math.abs(count) >= unitValue
  })

  if (unitIndex === -1) {
    return String(Math.round(count))
  }

  const unit = UNITS[unitIndex]
  const scaled = count / unit.value
  const rounded = Math.round(scaled * 10) / 10

  if (Math.abs(rounded) >= 1000 && unitIndex > 0) {
    const nextUnit = UNITS[unitIndex - 1]
    const nextRounded = Math.round((count / nextUnit.value) * 10) / 10

    return `${String(nextRounded).replace(/\.0$/, '')}${nextUnit.suffix}`
  }

  return `${String(rounded).replace(/\.0$/, '')}${unit.suffix}`
}

export default formatCount
