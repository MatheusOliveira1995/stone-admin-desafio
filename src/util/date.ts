export function formatDate(dateValue: Date | string) {
  if (!dateValue)
    return

  const date = new Date(dateValue)
  const monthDay = date.getDate()
  const month = date.getMonth()
  const year = String(date.getFullYear())


  return `${monthDay <= 9 ? '0' + (monthDay): monthDay}/${month < 9 ? '0' + (month + 1) : (month + 1)}/${year}`
}