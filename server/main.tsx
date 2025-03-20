import { onPageLoad } from 'meteor/server-render'

import '/server/publish'
import '/server/collections/common'
import '/server/collections/brand'
import '/server/collections/brandCategory'
import '/server/collections/user'
import '/server/collections/adminComment'
import '/server/collections/ticket'
import '/server/collections/notification'
import '/server/utils/images'

import '/imports/ui/main'
import { WebApp } from 'meteor/webapp'

onPageLoad(async (sink) => {})

WebApp.rawConnectHandlers.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  )

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  next()
})
