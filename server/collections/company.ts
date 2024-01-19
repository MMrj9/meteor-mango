import { Meteor } from 'meteor/meteor';
import { Company } from '/imports/api/company';


Meteor.methods({
    'company.insertOrUpdate'(company: Company) {
        if (!company || typeof company !== 'object') {
            throw new Meteor.Error('invalid-argument', 'Company data is required.');
        }

        const { name, description, employees } = company;

        if (!name || typeof name !== 'string') {
            throw new Meteor.Error('invalid-argument', 'Company name is required and must be a string.');
        }

        if (!description || typeof description !== 'string') {
            throw new Meteor.Error('invalid-argument', 'Company description is required and must be a string.');
        }

        if (!employees || typeof employees !== 'number' || employees < 0) {
            throw new Meteor.Error('invalid-argument', 'Number of employees is required and must be a non-negative number.');
        }
        
        if (company._id) {
            Company.update(company._id, { $set: company });
        } else {
            Company.insert(company);
        }
    },
});

