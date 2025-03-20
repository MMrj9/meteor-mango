import jwt from 'jsonwebtoken'
import { Meteor } from 'meteor/meteor'
import { Request, Response, NextFunction } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: Meteor.User
}

const JWT_SECRET = Meteor.settings.private.jwtSecret

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.sendStatus(401) // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err: any, userId: any) => {
    if (err) {
      return res.sendStatus(403) // Forbidden
    }

    const user = Meteor.users.findOne(userId)
    if (!user) {
      return res.sendStatus(401) // Unauthorized
    }

    req.user = user
    next()
  })
}
