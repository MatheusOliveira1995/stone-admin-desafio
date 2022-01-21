import moment from 'moment'
interface DatePattern {
  dateValue: Date | string | undefined,
  pattern?: "us" | "ptbr"
}
export function formatDate({ dateValue, pattern = "ptbr" }: DatePattern) {
  let date
  if (!dateValue) {
    date = moment()
  }
  else {
    date = moment(dateValue)
  }
  if (pattern === 'us') {
    const usDate = date.format('MM-DD-YYYY').toString()
    return usDate
  }

  return date.format('DD/MM/YYYY').toString()
}