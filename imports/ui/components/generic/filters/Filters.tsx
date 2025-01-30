interface SelectedFilters {
  active?: boolean | null
}

interface TableFilterOption {
  label: string
  value: any
}

interface TableFilter {
  key: string
  label: string
  type: 'text' | 'dropdown' | 'date'
  options?: TableFilterOption[]
}

export const NonDisabledFilter = {
  $or: [{ disabled: false }, { disabled: { $exists: false } }],
}

const DisabledTableFilter: TableFilter = {
  key: 'active',
  label: 'Active',
  type: 'dropdown',
  options: [
    { label: 'All', value: null },
    {
      label: 'Active',
      value: NonDisabledFilter,
    },
    { label: 'Not Active', value: { disabled: true } },
  ],
}

const buildQueryFromSelectedFilters = (
  filters: TableFilter[],
  selectedFilters: SelectedFilters,
) => {
  let query: { [key: string]: any } = {}

  for (const key in selectedFilters) {
    const filter = filters.find((filter) => filter.key === key)
    //@ts-ignore
    const selectedValue = selectedFilters[key]
    const option = filter?.options?.find(
      (option) => option.label === selectedValue,
    )
    query = { ...query, ...option?.value }
  }

  return query
}

export {
  TableFilterOption,
  TableFilter,
  SelectedFilters,
  buildQueryFromSelectedFilters,
  DisabledTableFilter,
}
