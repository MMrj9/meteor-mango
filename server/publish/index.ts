import { Meteor } from "meteor/meteor";
import { Company } from "/imports/api/company";

Meteor.publish('company', function (companyId) {
    // Check if companyId is provided and is a valid string
    if (companyId) {
        // If companyId is provided, publish the specific company with the given ID
        return Company.find({ _id: companyId });
    } else {
        // If companyId is not provided or not a valid string, publish all companies
        return Company.find({});
    }
});
