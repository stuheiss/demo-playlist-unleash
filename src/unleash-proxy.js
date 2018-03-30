/* proxy to an unleash server */
const express = require('express')
const request = require('request')
const cors = require('cors')

require('dotenv').config()

// get following from env
const unleashApiUrl = process.env.unleashApiUrl
const appName = process.env.appName
const instanceId = process.env.instanceId

const { initialize, isEnabled } = require('unleash-client')
const instance = initialize({
  url: unleashApiUrl,
  appName: appName,
  instanceId: instanceId
})

// optional events
//instance.on('error', () => console.log('error'))
//instance.on('warn', e => console.log('warn', e))
//instance.on('ready', x => console.log('ready', x))

instance.on('ready', serve)

function serve() {
  const PORT = 3004
  const app = express()
  app.use(cors())
  // userId strategey
  app.use('/api/flag/:flag/userId/:userId', (req, res) => {
    const flag = req.params.flag
    const context = {
      userId: req.params.userId
    }
    try {
      res.send(isEnabled(flag, context))
    } catch (e) {
      res.send('error')
    }
  })
  // default strategey
  app.use('/api/flag/:flag', (req, res) => {
    const flag = req.params.flag
    try {
      res.send(isEnabled(flag))
    } catch (e) {
      res.send('error')
    }
  })
  //app.listen(process.env.PORT || 3000)
  console.log(`listening on http://localhost:${PORT}`)
  app.listen(PORT)
}
