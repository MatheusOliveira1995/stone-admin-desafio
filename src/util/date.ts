interface DatePattern {
  dateValue: Date | string,
  pattern?: "us" | "ptbr"
}
export function formatDate({ dateValue , pattern = "ptbr"}: DatePattern) {
  if (!dateValue)
    return
    
  const date = new Date(dateValue)
  const monthDay = date.getDate()
  const month = date.getMonth()
  const year = String(date.getFullYear())

  if(pattern === 'us'){
    return `${month < 9 ? '0' + (month + 1) : (month + 1)}-${monthDay <= 9 ? '0' + (monthDay): monthDay}-${year}`
  }

  return `${monthDay <= 9 ? '0' + (monthDay): monthDay}/${month < 9 ? '0' + (month + 1) : (month + 1)}/${year}`
}