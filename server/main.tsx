import { onPageLoad } from 'meteor/server-render'

import '/server/publish'
import '/server/collections/common'
import '/server/collections/company'
import '/server/collections/user'
import '/server/collections/adminComment'

import '/imports/ui/main'

onPageLoad(async (sink) => {})
