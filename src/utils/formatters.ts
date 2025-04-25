// src/utils/formatters.ts

/**
 * Format a date object to a readable string
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A'

  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format a date object to show only the year
 */
export const formatYearOnly = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A'

  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.getFullYear().toString()
}
/**
 * Format a number with commas as thousands separators
 */
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return 'N/A'
  return num.toLocaleString('en-US')
}

/**
 * Format a player's full name
 */
export const formatPlayerName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`
}

/**
 * Format a measurement in feet and inches
 */
export const formatHeight = (inches: number): string => {
  if (!inches) return 'N/A'

  const feet = Math.floor(inches / 12)
  const remainingInches = inches % 12
  return `${feet}'${remainingInches}"`
}

/**
 * Format weight in pounds
 */
export const formatWeight = (pounds: number): string => {
  if (!pounds) return 'N/A'
  return `${pounds} lbs`
}

/**
 * Format a combine score as a percentage
 */
export const formatCombineScore = (score: number): string => {
  if (!score && score !== 0) return 'N/A'
  return `${score.toFixed(1)}`
}
