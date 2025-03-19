import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
//@ts-ignore
import { Roles } from 'meteor/alanning:roles'
import { validateEmail } from '/imports/utils/string'
import { validateObject } from '/imports/utils/object'
import {
  AdminRoles,
  AllRoles,
  DefaultRoles,
  Profile,
  validateUserPermissions,
} from '/imports/api/user'
import { logChanges } from '/imports/api/changelog'
import { check } from 'meteor/check'
import { WebApp } from 'meteor/webapp'

function validateUser(user: any) {
  validateObject(user)

  const { username, email } = user

  if (!validateEmail(email)) {
    throw new Meteor.Error(
      'invalid-argument',
      'Valid email address is required.',
    )
  }

  if (!user._id && Meteor.users.findOne({ username })) {
    throw new Meteor.Error('username-taken', 'Username is already taken.')
  }

  if (!user._id && Meteor.users.findOne({ 'emails.address': email })) {
    throw new Meteor.Error('email-taken', 'Email address is already taken.')
  }
}

const getUserById = (_id: string) => {
  const user = Meteor.users.findOne({ _id })
  if (!user) throw new Meteor.Error('not-fount', 'User not found.')
  return user
}

Meteor.methods({
  'User.register': async (data) => {
    validateUser(data)

    const profile: Profile = {}
    data['profile'] = profile

    const id = await Accounts.createUser(data)

    if (Meteor.users.find().count() === 1) Roles.addUsersToRoles(id, AdminRoles)
    else Roles.addUsersToRoles(id, DefaultRoles)

    return id
  },
  'User.insertOrUpdate': (data: any) => {
    validateUserPermissions()

    const _id = data._id
    const user = getUserById(_id)
    const newRoles = data['roles']
    const existingRoles = Roles.getRolesForUser(user)

    if (newRoles) {
      newRoles.forEach((newRole: string) => {
        if (!AllRoles.includes(newRole))
          throw new Meteor.Error('invalid-role', 'Invalid Role')
        if (!existingRoles.includes(newRole))
          Roles.addUsersToRoles(user._id, [newRole])
      })
      existingRoles.forEach((existingRole: string) => {
        if (!newRoles.includes(existingRole))
          Roles.removeUsersFromRoles(user._id, [existingRole])
      })
    }

    const updatedUser = getUserById(data._id)
    logChanges(_id, 'user', 'update', user, updatedUser)
  },
  'User.profile.update': (user_id: string, profileData: Profile) => {
    check(user_id, String)
    check(profileData, Object)

    if (user_id !== Meteor.userId()) {
      throw new Meteor.Error('invalid-permissions', 'Invalid Permissions')
    }

    const user = Meteor.users.findOne(user_id)
    if (!user) {
      throw new Meteor.Error('user-not-found', 'User not found')
    }

    Meteor.users.update(user_id, {
      $set: {
        profile: profileData,
      },
    })

    const updatedUser = Meteor.users.findOne(user_id)
    logChanges(user_id, 'user', 'update', user, updatedUser as Meteor.User)
  },
  'User.get.admin.usernames': () => {
    const admins = Roles.getUsersInRole(AdminRoles).fetch()
    return admins.map((admin: Meteor.User) => admin.username)
  },
})

Meteor.startup(() => {
  AllRoles.forEach(function (role) {
    Roles.createRole(role, { unlessExists: true });
  });

  // Define API endpoints
  WebApp.connectHandlers.use('/api/user/register', (req, res) => {
    if (req.method === 'POST') {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        const data = JSON.parse(body);
        try {
          const userId = await Meteor.call('User.register', data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ userId }));
        } catch (error: any) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
  });

  WebApp.connectHandlers.use('/api/user/login', (req, res) => {
    if (req.method === 'POST') {
      let body = '';
  
      req.on('data', chunk => {
        body += chunk.toString();
      });
  
      req.on('end', async () => {
        const { username, password } = JSON.parse(body);
        try {
          const loginResult = await Meteor.call('login', { username, password });
  
          if (loginResult && loginResult.token) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token: loginResult.token }));
          } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid username or password' }));
          }
        } catch (error: any) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
  });

  WebApp.connectHandlers.use('/api/user/change-password', (req, res) => {
    if (req.method === 'POST') {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const { userId, oldPassword, newPassword } = JSON.parse(body);
        try {
          const user = Meteor.users.findOne(userId);
          if (user && Accounts._checkPassword(user, oldPassword)) {
            Accounts.setPassword(userId, newPassword);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid old password' }));
          }
        } catch (error: any) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
  });
});
