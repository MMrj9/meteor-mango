import moment from 'moment'

const formatDate = (date: Date): string => {
  const formattedDate = moment(date).format('DD-MM-YYYY HH:mm')
  return formattedDate
}

export { formatDate }
