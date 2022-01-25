import moment from 'moment'
interface DatePattern {
  dateValue: Date | string | undefined,
  pattern?: "us" | "ptbr",
  format?: string
}
export function formatDate({ dateValue, pattern = "ptbr", format }: DatePattern) {
  let date
  if (!dateValue) {
    date = moment()
  }
  else {
    date = moment(dateValue, format)
  }
  if (pattern === 'us') {
    const usDate = date.format('MM-DD-YYYY').toString()
    return usDate
  }

  return date.format('DD/MM/YYYY').toString()
}