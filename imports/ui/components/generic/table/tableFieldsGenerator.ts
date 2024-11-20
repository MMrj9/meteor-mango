import { FieldProperties } from "/imports/api";

interface TableField {
    key: string;
    label: string;
  }
  
  const generateTableFields = (
    schema: Record<string, FieldProperties>
  ): TableField[] => {
    return Object.entries(schema)
      .filter(([_, fieldProperties]) => fieldProperties.tableView)
      .map(([key, fieldProperties]) => ({
        key,
        label: fieldProperties.label || key,
      }));
  };

export { TableField, generateTableFields }