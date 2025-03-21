---

## Running and Testing the App

### Prerequisites

To run and test this app, ensure the following are installed on your system:

- **Node.js** (latest LTS version recommended)
- **Meteor** (installation instructions can be found at [Meteor Installation Guide](https://www.meteor.com/install))

Once installed, clone the repository and run the following command to install dependencies:

```bash
meteor npm install
```

---

### Available NPM Scripts

The app comes with a set of predefined `npm` scripts to handle various tasks. Below is a detailed guide:

#### **Start the Application**

Runs the Meteor application in development mode.

```bash
meteor npm run start
```

- This will start the app on the default Meteor port (usually `localhost:3000`).

#### **Run Tests**

Runs unit and integration tests once using the Mocha test framework.

```bash
meteor npm run test
```

- Output: Test results will appear in the console.

#### **Run Full App Tests (with Watch Mode)**

Runs tests in watch mode for continuous testing during development.

```bash
meteor npm run test-app
```

- This runs the entire app with the testing environment enabled, using the `meteortesting:mocha` package.

---

#### **Visualize Production Build**

Generates a production build and visualizes the bundle size using `bundle-visualizer`.

```bash
meteor npm run visualize
```

- Helps optimize the app's build size by analyzing bundle contents.

---

#### **Format Code**

Automatically formats the codebase using `Prettier`.

```bash
meteor npm run format
```

- Ensures consistency across the codebase.

#### **Check Code Formatting**

Checks if the code adheres to `Prettier` formatting rules without making changes.

```bash
meteor npm run format-check
```

---

### Custom Schema Format Documentation

| **Property**                | **Type**                   | **Description**                                                                     | **Optional** | **Notes**                                  |
| --------------------------- | -------------------------- | ----------------------------------------------------------------------------------- | ------------ | ------------------------------------------ |
| **SimpleSchema Properties** |
| `type`                      | `Function`                 | Specifies the data type of the field (`String`, `Number`, `Date`, `Boolean`, etc.). | No           |                                            |
| `label`                     | `String`                   | A human-readable label for the field.                                               | Yes          | Used for forms and documentation.          |
| `optional`                  | `Boolean`                  | Indicates whether the field is optional.                                            | Yes          | Default is `false`.                        |
| `min`                       | `Number`                   | Minimum value or length for the field.                                              | Yes          | Applies to `String`, `Number`, or `Array`. |
| `max`                       | `Number`                   | Maximum value or length for the field.                                              | Yes          | Applies to `String`, `Number`, or `Array`. |
| `regEx`                     | `RegExp`                   | Regular expression to validate string fields.                                       | Yes          | E.g., `SimpleSchema.RegEx.Email`.          |
| `blackbox`                  | `Boolean`                  | Disables validation for nested object fields.                                       | Yes          | Applies to `Object`.                       |
| `defaultValue`              | `Any`                      | Specifies a default value for the field.                                            | Yes          |                                            |
| `allowedValues`             | `Array`                    | Array of allowed values for the field.                                              | Yes          |                                            |
| `autoValue`                 | `Function`                 | Sets a value automatically based on a defined logic.                                | Yes          | Common for timestamps.                     |
| `custom`                    | `Function`                 | Adds custom validation logic for the field.                                         | Yes          | Should return a string for error messages. |
| `decimal`                   | `Boolean`                  | Allows decimal values for `Number` fields.                                          | Yes          | Default is `false`.                        |
| `schema`                    | `Object` or `SimpleSchema` | Nested schema definition for `Object` or `Array` fields.                            | Yes          |                                            |
| **Custom Properties**       |
| `editable`                  | `Boolean`                  | Indicates if the field can be edited by users.                                      | Yes          | Default is `true`.                         |
| `formFieldType`             | `FormFieldType`            | Defines the type of form field. Possible values:                                    | Yes          | Used to generate form UI components.       |
| `tableView`                 | `Boolean`                  | Indicates if the field will be shown in table view.                                 | Yes          | Default is `false`                         |
| `optionsCollection`         | `String`                   | Specifies a collection to fetch options from.                                       | Yes          | Used for autocomplete fields.              |
| `optionsCollectionKey`      | `String`                   | The key to use from the options collection.                                         | Yes          |                                            |

---

### `FormFieldType` Enum

The `formFieldType` property supports the following values:

| **Value**      | **Description**                           |
| -------------- | ----------------------------------------- |
| `TEXT`         | Standard text input field.                |
| `TEXTAREA`     | Multi-line text input.                    |
| `NUMBER`       | Numeric input field.                      |
| `CHECKBOX`     | Checkbox for boolean input.               |
| `AUTOCOMPLETE` | Autocomplete input for predefined values. |
| `ARRAY`        | Input field for arrays of values.         |
| `OBJECT`       | Input field for nested objects.           |
| `IMAGE`        | Input field for image URLs.               |

---

### Example Schema: **`CompanySchema`**

Here’s how the custom properties are applied in a schema:

```markdown
const TimestampedSchemaBase: Record<string, FieldProperties> = {
createdOn: {
type: Date,
label: 'Created On',
editable: false,
},
updatedOn: {
type: Date,
label: 'Updated On',
optional: true,
editable: false,
},
}

const DisabledSchemaBase = {
disabled: {
type: Boolean,
optional: true,
},
}

const CompanySchema: Record<string, FieldProperties> = {
name: {
type: String,
label: 'Name',
min: 1,
max: 50,
},
description: {
type: String,
label: 'Description',
min: 0,
max: 300,
},
numberOfEmployees: {
type: SimpleSchema.Integer,
label: 'Number of Employees',
min: 0,
max: 999,
},
tags: {
type: Array,
label: 'Tags',
},
'tags.$': {
type: String,
},
...TimestampedSchemaBase,
...DisabledSchemaBase,
}
```

### Example Schema: **`BrandSchema`**

```markdown
const BrandSchema: Record<string, FieldProperties> = {
name: {
type: String,
label: 'Name',
min: 1,
max: 100,
tableView: true,
},
description: {
type: String,
label: 'Description',
min: 0,
max: 5000,
optional: true,
formFieldType: FormFieldType.TEXTAREA,
},
website: {
type: String,
label: 'Website',
optional: true,
},
email: {
type: String,
label: 'Email',
optional: true,
},
socialNetworks: {
type: Array,
label: 'Social Networks',
optional: true,
},
'socialNetworks.$': {
    type: Object,
  },
  'socialNetworks.$.name': {
type: String,
label: 'Name',
allowedValues: ['Facebook', 'Instagram', 'LinkedIn', 'YouTube'],
},
'socialNetworks.$.link': {
    type: String,
    label: 'Link',
  },
  categories: {
    type: Array,
    label: 'Categories',
    optionsCollection: 'BrandCategory',
    optionsCollectionKey: 'name',
    formFieldType: FormFieldType.AUTOCOMPLETE,
  },
  'categories.$': {
type: String,
},
images: {
type: Array,
label: 'Images',
},
'images.$': {
type: String,
formFieldType: FormFieldType.IMAGE,
},
...TimestampedSchemaBase,
...DisabledSchemaBase,
}
```

### Example Schema: **`BrandCategorySchema`**

```markdown
const BrandCategorySchema: Record<string, FieldProperties> = {
name: {
type: String,
label: 'Name',
min: 1,
max: 100,
tableView: true,
},
description: {
type: String,
label: 'Description',
min: 0,
max: 2000,
formFieldType: FormFieldType.TEXTAREA,
optional: true,
},
images: {
type: String,
label: 'Image',
formFieldType: FormFieldType.IMAGE,
optional: true,
},
...TimestampedSchemaBase,
...DisabledSchemaBase,
}
```

### Example Schema: **`ChangelogSchema`**

```markdown
const ChangelogSchema: Record<string, FieldProperties> = {
\_id: {
type: String,
optional: true,
},
objectId: {
type: String,
label: 'Object ID',
},
collection: {
type: String,
label: 'Collection',
},
user: {
type: String,
label: 'User Username',
},
changeType: {
type: String,
label: 'Change Type',
},
timestamp: {
type: Date,
label: 'Timestamp',
},
changes: {
type: Array,
label: 'Changes',
schema: FieldChangeSchema,
},
}
```

### Example Schema: **`AdminCommentSchema`**

```markdown
const AdminCommentSchema: Record<string, FieldProperties> = {
\_id: {
type: String,
optional: true,
},
objectId: {
type: String,
label: 'Object ID',
},
collection: {
type: String,
label: 'Collection',
},
user: {
type: String,
label: 'User Username',
},
text: {
type: String,
label: 'text',
},
...TimestampedSchemaBase,
...DisabledSchemaBase,
}
```

---
