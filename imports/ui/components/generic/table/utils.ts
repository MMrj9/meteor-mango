import { formatDate } from '/imports/utils/date'

const formatTableData = (data: any) => {
  if (data) {
    if (data instanceof Date) return formatDate(data)
    else return data.toString()
  }
}

export { formatTableData }
