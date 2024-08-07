import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@chakra-ui/react'

const UserProfileLink = () => {
    const user = Meteor.user()
    if (!user) return null

    return (
        <Link
            as={RouterLink}
            to={`/me`}
            color="teal.500"
        >
            {user.username}
        </Link>
    )
}

export default UserProfileLink
