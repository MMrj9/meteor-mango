import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { validateEmail } from '/imports/utils/string';


interface Profile {
    roles: string[]
}

Meteor.methods({
    'user.register': async (user) => {
        console.log("here");
        if (!user || typeof user !== 'object') {
            throw new Meteor.Error('invalid-argument', 'Company data is required.');
        }
        console.log("here");
        
        const { username, email, password } = user;

        if (!username || typeof username !== 'string') {
            throw new Meteor.Error('invalid-argument', 'Username is required and must be a string.');
        }

        if (!email || typeof email !== 'string' || !validateEmail(email)) {
            throw new Meteor.Error('invalid-argument', 'Valid email address is required.');
        }

        if (!password || typeof password !== 'string') {
            throw new Meteor.Error('invalid-argument', 'Password is required and must be a string.');
        }


        const profile: Profile = {
            roles: ['admin']
        }
        user['profile'] = profile
        console.log("user");

        const res =  await Accounts.createUser(user);
        console.log(res);
        return res
    },
});

