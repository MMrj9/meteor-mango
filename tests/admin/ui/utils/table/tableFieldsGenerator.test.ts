import { expect } from "chai";
import { generateTableFields } from "/imports/ui/components/generic/table/tableFieldsGenerator";
import { FieldProperties } from "/imports/api";

describe('generateTableFields', () => {
    const mockSchema: Record<string, FieldProperties> = {
      name: {
        type: String,
        label: 'Name',
        tableView: true,
      },
      description: {
        type: String,
        label: 'Description',
      },
      numberOfEmployees: {
        type: Number,
        label: 'Number of Employees',
        tableView: false,
      },
      tags: {
        type: Array,
        label: 'Tags',
        tableView: false,
      },
      createdOn: {
        type: Date,
        label: 'Created On',
        tableView: true,
      },
      updatedOn: {
        type: Date,
        label: 'Updated On',
      },
    };
  
    it('should include fields with tableView: true and ignore others', () => {
      const result = generateTableFields(mockSchema);
  
      expect(result).to.deep.equal([
        { key: 'name', label: 'Name' },
        { key: 'createdOn', label: 'Created On' },
      ]);
    });
  
    it('should ignore fields with tableView: false or not declared', () => {
      const result = generateTableFields(mockSchema);
  
      const ignoredFields = result.filter(
        (field) =>
          field.key === 'numberOfEmployees' ||
          field.key === 'tags' ||
          field.key === 'description' ||
          field.key === 'updatedOn'
      );
  
      expect(ignoredFields).to.be.empty;
    });
  
    it('should handle schemas with no fields marked for tableView', () => {
      const noTableViewSchema: Record<string, FieldProperties> = {
        field1: { type: String, label: 'Field 1', tableView: false },
        field2: { type: Number, label: 'Field 2' },
      };
  
      const result = generateTableFields(noTableViewSchema);
      expect(result).to.deep.equal([]);
    });
  
    it('should use the field key as the label if no label is provided for tableView: true', () => {
      const schemaWithoutLabels: Record<string, FieldProperties> = {
        field1: { type: String, tableView: true },
        field2: { type: Number, tableView: true },
      };
  
      const result = generateTableFields(schemaWithoutLabels);
      expect(result).to.deep.equal([
        { key: 'field1', label: 'field1' },
        { key: 'field2', label: 'field2' },
      ]);
    });
  
    it('should handle an empty schema gracefully', () => {
      const result = generateTableFields({});
      expect(result).to.deep.equal([]);
    });
  
    it('should not include fields with tableView explicitly set to false', () => {
      const schemaWithFalseTableView: Record<string, FieldProperties> = {
        field1: { type: String, label: 'Field 1', tableView: true },
        field2: { type: String, label: 'Field 2', tableView: false },
      };
  
      const result = generateTableFields(schemaWithFalseTableView);
      expect(result).to.deep.equal([{ key: 'field1', label: 'Field 1' }]);
    });
  });